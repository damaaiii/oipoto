import React, { useEffect, useState } from 'react';
import {
  ArrowUpDown,
  Camera,
  Download,
  Edit3,
  FolderHeart,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { PhotoboothProjectState, SavedGalleryItem } from '../types/photobooth';
import { renderPhotoboothToCanvas } from '../utils/canvasRenderer';
import {
  clearEntireGallery,
  deleteGalleryCreation,
  listGalleryCreations,
} from '../utils/galleryDb';

interface MyGalleryProps {
  refreshKey: number;
  onReopenProject: (project: PhotoboothProjectState) => void;
  onStartNewSession: () => void;
}

export const MyGallery: React.FC<MyGalleryProps> = ({
  refreshKey,
  onReopenProject,
  onStartNewSession,
}) => {
  const [items, setItems] = useState<SavedGalleryItem[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<SavedGalleryItem | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await listGalleryCreations(sortOrder);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [sortOrder, refreshKey]);

  const handleDeleteOne = async (id: string) => {
    await deleteGalleryCreation(id);
    if (previewItem?.id === id) setPreviewItem(null);
    await loadItems();
  };

  const handleClearAll = async () => {
    await clearEntireGallery();
    setConfirmClearAll(false);
    setPreviewItem(null);
    await loadItems();
  };

  const handleDownloadItem = async (
    item: SavedGalleryItem,
    fmt: 'png' | 'jpg'
  ) => {
    const canvas = await renderPhotoboothToCanvas(item.projectState, undefined, 1);
    const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mime, fmt === 'jpg' ? 0.94 : undefined);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `oipoto-${item.studioId}-${item.id}.${fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareItem = async (item: SavedGalleryItem) => {
    if (typeof navigator.share !== 'function') return;
    const canvas = await renderPhotoboothToCanvas(item.projectState, undefined, 1);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), 'image/png')
    );
    if (!blob) return;
    const file = new File([blob], `oipoto-${item.id}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'OIPOTO Photobooth Strip',
        files: [file],
      });
    }
  };

  const supportsWebShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#D9B6C5]/50">
        <div>
          <p className="text-xs font-medium text-[#68525D]">
            Stored locally on this device (IndexedDB)
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#4A3740]">
            My Gallery
          </h1>
          <p className="mt-1.5 text-sm text-[#68525D]">
            Your saved photobooth strips and collages stay private on this browser.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
              }
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#D9B6C5] text-xs font-semibold text-[#4A3740] inline-flex items-center gap-1.5 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmClearAll(true)}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#D9B6C5] text-xs font-semibold text-[#C84B78] inline-flex items-center gap-1.5 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Gallery</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-[#68525D]">
          Loading your local creations...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white border border-[#D9B6C5]/70 p-8 sm:p-12 text-center max-w-xl mx-auto">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FCE7ED] flex items-center justify-center text-[#68525D]">
            <FolderHeart className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#4A3740]">
            No Saved Photobooth Strips Yet
          </h2>
          <p className="mt-2 text-sm text-[#68525D]">
            Snap live shots in the camera booth or upload favorite pictures from your phone to create your first memory strip.
          </p>
          <button
            type="button"
            onClick={onStartNewSession}
            className="mt-6 min-h-[46px] px-6 py-2.5 rounded-xl bg-[#68525D] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#534049] transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Start Taking Photos</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-4 flex flex-col justify-between"
            >
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                className="group w-full aspect-[3/4] rounded-2xl bg-[#FFF6EC] overflow-hidden flex items-center justify-center p-3 cursor-pointer"
                aria-label={`Preview ${item.frameName}`}
              >
                <img
                  src={item.previewDataUrl}
                  alt={`${item.studioName} ${item.frameName}`}
                  className="max-h-full max-w-full object-contain rounded-md shadow-sm group-hover:scale-[1.02] transition-transform duration-200"
                />
              </button>

              <div className="mt-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#68525D]">
                  <span className="font-semibold text-[#C84B78]">{item.studioName}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="mt-0.5 text-sm font-bold text-[#4A3740] truncate">
                  {item.frameName}
                </h3>
                <p className="text-xs text-[#68525D] truncate">{item.layoutName}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#D9B6C5]/40 grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onReopenProject(item.projectState)}
                  className="min-h-[38px] px-2 rounded-xl bg-[#FCE7ED] text-[#4A3740] text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-[#F6CAD8] cursor-pointer"
                  title="Reopen in Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadItem(item, 'png')}
                  className="min-h-[38px] px-2 rounded-xl bg-[#FFF6EC] text-[#4A3740] text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-[#FCE7ED] cursor-pointer"
                  title="Download PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOne(item.id)}
                  className="min-h-[38px] px-2 rounded-xl bg-white border border-[#D9B6C5]/60 text-[#C84B78] text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-[#FCE7ED] cursor-pointer"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Del</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Full Preview Lightbox Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3740]/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-3xl bg-[#FFF6EC] border border-[#D9B6C5] p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#D9B6C5]/50">
              <div>
                <p className="text-xs font-medium text-[#C84B78]">
                  {previewItem.studioName} · {previewItem.layoutName}
                </p>
                <h3 className="text-lg font-bold text-[#4A3740]">
                  {previewItem.frameName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#FCE7ED] cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex justify-center bg-white rounded-2xl p-4 border border-[#D9B6C5]/50">
              <img
                src={previewItem.previewDataUrl}
                alt={previewItem.frameName}
                className="max-h-[54vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const state = previewItem.projectState;
                    setPreviewItem(null);
                    onReopenProject(state);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FCE7ED] text-[#4A3740] text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#F6CAD8] cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Reopen in Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadItem(previewItem, 'png')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#68525D] text-white text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#534049] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadItem(previewItem, 'jpg')}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-[#4A3740] text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#FCE7ED] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>JPG</span>
                </button>
                {supportsWebShare && (
                  <button
                    type="button"
                    onClick={() => handleShareItem(previewItem)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E7DDF3] text-[#4A3740] text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#d8c9eb] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteOne(previewItem.id)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-[#C84B78] text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#FCE7ED] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {confirmClearAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3740]/55 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-[#FFF6EC] border border-[#D9B6C5] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#4A3740]">Clear Entire Gallery?</h3>
            <p className="mt-2 text-sm text-[#68525D]">
              This removes all saved OIPOTO photobooth strips from your local device storage. This cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmClearAll(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-sm font-semibold text-[#4A3740] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C84B78] text-white text-sm font-semibold cursor-pointer"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
