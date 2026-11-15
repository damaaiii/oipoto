import React, { useState } from 'react';
import { BookmarkCheck, Check, Download, PlusCircle, Share2 } from 'lucide-react';
import { getFrameById, getLayoutById, getStudioById } from '../data/studios';
import { PhotoboothProjectState } from '../types/photobooth';
import { renderPhotoboothToCanvas } from '../utils/canvasRenderer';
import { saveCreationToGallery } from '../utils/galleryDb';

interface DownloadManagerProps {
  project: PhotoboothProjectState;
  onCreateAnother: () => void;
  onSavedToGallery?: () => void;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({
  project,
  onCreateAnother,
  onSavedToGallery,
}) => {
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [savedConfirmed, setSavedConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const supportsWebShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function';

  const generateExportBlob = async (
    exportFormat: 'png' | 'jpg'
  ): Promise<{ blob: Blob; dataUrl: string }> => {
    const canvas = await renderPhotoboothToCanvas(project, undefined, 1);
    const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
    const quality = exportFormat === 'png' ? undefined : 0.94;
    const dataUrl = canvas.toDataURL(mime, quality);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to generate image blob'))),
        mime,
        quality
      );
    });
    return { blob, dataUrl };
  };

  const handleSaveToLocalGallery = async (existingDataUrl?: string) => {
    const studio = getStudioById(project.studioId);
    const frame = getFrameById(project.frameId);
    const layout = getLayoutById(project.layoutId);

    const dataUrl =
      existingDataUrl ||
      (await renderPhotoboothToCanvas(project, undefined, 0.7)).toDataURL('image/jpeg', 0.88);

    await saveCreationToGallery({
      id: `oipoto_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      studioId: studio.id,
      studioName: studio.name,
      frameName: frame.name,
      layoutName: layout.name,
      previewDataUrl: dataUrl,
      projectState: project,
    });

    setSavedConfirmed(true);
    onSavedToGallery?.();
  };

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const { blob, dataUrl } = await generateExportBlob(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `oipoto-${project.studioId}-${timestamp}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      if (!savedConfirmed) {
        await handleSaveToLocalGallery(dataUrl);
      }
      setStatusMessage(`Downloaded ${format.toUpperCase()} and saved to My Gallery.`);
    } catch {
      setStatusMessage('Could not export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const { blob, dataUrl } = await generateExportBlob('png');
      const file = new File([blob], `oipoto-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My OIPOTO Photobooth Strip',
          text: 'Created with OIPOTO — Your moments, your little photo studio.',
          files: [file],
        });
        if (!savedConfirmed) {
          await handleSaveToLocalGallery(dataUrl);
        }
        setStatusMessage('Shared successfully!');
      } else {
        setStatusMessage('Sharing files is not supported in this browser. Use Download Photo instead.');
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatusMessage(null);
      } else {
        setStatusMessage('Share cancelled or unavailable on this browser — use Download Photo.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[#4A3740]">Export Format</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(['png', 'jpg'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold uppercase border transition-colors cursor-pointer ${
                format === fmt
                  ? 'bg-[#68525D] text-white border-[#68525D]'
                  : 'bg-[#FFF6EC] text-[#4A3740] border-[#D9B6C5] hover:bg-[#FCE7ED]'
              }`}
            >
              {fmt} {fmt === 'png' ? '· Lossless' : '· Compact'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          disabled={isExporting}
          onClick={handleDownload}
          className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#68525D] text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#534049] disabled:opacity-60 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Rendering High-Res...' : `Download Photo (${format.toUpperCase()})`}</span>
        </button>

        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleSaveToLocalGallery()}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FCE7ED] text-[#4A3740] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#F6CAD8] transition-colors cursor-pointer"
        >
          {savedConfirmed ? (
            <>
              <Check className="w-4 h-4 text-[#C84B78]" />
              <span>Saved in My Gallery</span>
            </>
          ) : (
            <>
              <BookmarkCheck className="w-4 h-4" />
              <span>Save to My Gallery</span>
            </>
          )}
        </button>

        {supportsWebShare && (
          <button
            type="button"
            disabled={isExporting}
            onClick={handleShare}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#E7DDF3] text-[#4A3740] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#d9cbec] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Photo</span>
          </button>
        )}

        <button
          type="button"
          onClick={onCreateAnother}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D9B6C5] bg-white text-[#4A3740] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#FFF6EC] transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Another</span>
        </button>
      </div>

      {statusMessage && (
        <p className="text-xs font-medium text-[#4A3740] bg-[#FFF6EC] border border-[#D9B6C5]/70 rounded-xl p-3">
          {statusMessage}
        </p>
      )}
    </div>
  );
};
