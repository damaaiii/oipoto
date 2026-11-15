import React, { useRef, useState } from 'react';
import {
  Check,
  Crop,
  ImagePlus,
  RefreshCw,
  RotateCw,
  ShieldCheck,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CapturedPhoto, PhotoTransform } from '../types/photobooth';

interface UploadStudioProps {
  photos: CapturedPhoto[];
  onPhotosChange: (photos: CapturedPhoto[]) => void;
  onProceedToEditor: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export const UploadStudio: React.FC<UploadStudioProps> = ({
  photos,
  onPhotosChange,
  onProceedToEditor,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftTransform, setDraftTransform] = useState<PhotoTransform>({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  });
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadNotice(null);

    const validFiles = Array.from(fileList).filter((f) =>
      ACCEPTED_TYPES.includes(f.type.toLowerCase()) ||
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );

    if (validFiles.length === 0) {
      setUploadNotice('Please select JPG, JPEG, PNG, or WebP images.');
      return;
    }

    const newItems: CapturedPhoto[] = [];
    for (const file of validFiles.slice(0, 8)) {
      const dataUrl = await readFileAsDataUrl(file);
      newItems.push({
        id: `up_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        dataUrl,
        source: 'upload',
        transform: {
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
        },
      });
    }

    onPhotosChange([...photos, ...newItems].slice(0, 8));
  };

  const handleReplaceFile = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || replaceIndex === null) return;
    const file = fileList[0];
    const dataUrl = await readFileAsDataUrl(file);
    const next = [...photos];
    next[replaceIndex] = {
      id: `up_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      dataUrl,
      source: 'upload',
      transform: { zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 },
    };
    onPhotosChange(next);
    setReplaceIndex(null);
  };

  const handleRemovePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  const openCropModal = (index: number) => {
    setEditingIndex(index);
    setDraftTransform({ ...photos[index].transform });
  };

  const saveCropModal = () => {
    if (editingIndex === null) return;
    const next = [...photos];
    next[editingIndex] = {
      ...next[editingIndex],
      transform: { ...draftTransform },
    };
    onPhotosChange(next);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center transition-colors ${
          isDraggingOver
            ? 'border-[#C84B78] bg-[#FCE7ED]/70'
            : 'border-[#D9B6C5] bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            handleReplaceFile(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FCE7ED] flex items-center justify-center text-[#68525D]">
          <ImagePlus className="w-7 h-7" />
        </div>
        <h3 className="mt-4 text-lg sm:text-xl font-bold text-[#4A3740]">
          Upload Photos from Your Device
        </h3>
        <p className="mt-1.5 text-sm text-[#68525D] max-w-md mx-auto">
          Select 1 to 4 photos (JPG, JPEG, PNG, WebP) to turn into a photobooth strip or collage.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#68525D] text-white text-sm font-semibold hover:bg-[#534049] transition-colors cursor-pointer"
          >
            Choose Photos
          </button>
          {photos.length > 0 && (
            <button
              type="button"
              onClick={onProceedToEditor}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C84B78] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#b03c67] transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Continue to Editor ({photos.length})</span>
            </button>
          )}
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#68525D]">
          <ShieldCheck className="w-4 h-4 text-[#C84B78]" />
          <span>Processed locally in your browser — photos are never uploaded to any server.</span>
        </p>

        {uploadNotice && (
          <p className="mt-3 text-xs font-semibold text-[#C84B78]">{uploadNotice}</p>
        )}
      </div>

      {/* Uploaded Photo Grid */}
      {photos.length > 0 && (
        <div className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9B6C5]/40">
            <div>
              <h4 className="text-base font-bold text-[#4A3740]">
                Selected Photos ({photos.length})
              </h4>
              <p className="text-xs text-[#68525D]">
                Adjust crop, zoom, rotation, or replace any slot before styling.
              </p>
            </div>
            <button
              type="button"
              onClick={onProceedToEditor}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#68525D] text-white text-sm font-semibold hover:bg-[#534049] transition-colors cursor-pointer"
            >
              Open Photo Editor
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="rounded-2xl border border-[#D9B6C5]/60 bg-[#FFF6EC] p-3 flex flex-col gap-3"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
                  <img
                    src={photo.dataUrl}
                    alt={`Uploaded slot ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${photo.transform.offsetX * 25}%, ${
                        photo.transform.offsetY * 25
                      }%) scale(${photo.transform.zoom}) rotate(${
                        photo.transform.rotation
                      }deg)`,
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#4A3740]/80 text-white text-[11px] font-semibold tabular-nums">
                    #{idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => openCropModal(idx)}
                    className="min-h-[40px] px-2 py-1.5 rounded-lg bg-white border border-[#D9B6C5]/60 text-[#4A3740] text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
                    title="Crop & Reposition"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Crop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplaceIndex(idx);
                      replaceInputRef.current?.click();
                    }}
                    className="min-h-[40px] px-2 py-1.5 rounded-lg bg-white border border-[#D9B6C5]/60 text-[#4A3740] text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
                    title="Replace Photo"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Swap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="min-h-[40px] px-2 py-1.5 rounded-lg bg-white border border-[#D9B6C5]/60 text-[#C84B78] text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Del</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crop / Zoom / Rotate / Reposition Modal */}
      {editingIndex !== null && photos[editingIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3740]/55 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crop-modal-title"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#FFF6EC] border border-[#D9B6C5] p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4">
              <h3 id="crop-modal-title" className="text-lg font-bold text-[#4A3740]">
                Crop & Reposition Photo #{editingIndex + 1}
              </h3>
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#FCE7ED] cursor-pointer"
                aria-label="Close crop dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#2B2025] border border-[#D9B6C5] relative">
              <img
                src={photos[editingIndex].dataUrl}
                alt="Crop preview"
                className="w-full h-full object-cover transition-transform duration-75"
                style={{
                  transform: `translate(${draftTransform.offsetX * 25}%, ${
                    draftTransform.offsetY * 25
                  }%) scale(${draftTransform.zoom}) rotate(${draftTransform.rotation}deg)`,
                }}
              />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#4A3740]">
                  <span className="inline-flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </span>
                  <span className="tabular-nums">{draftTransform.zoom.toFixed(2)}x</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTransform((t) => ({
                        ...t,
                        zoom: Math.max(1, Number((t.zoom - 0.15).toFixed(2))),
                      }))
                    }
                    className="min-w-[40px] min-h-[40px] rounded-xl bg-white border border-[#D9B6C5] flex items-center justify-center cursor-pointer"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={2.8}
                    step={0.05}
                    value={draftTransform.zoom}
                    onChange={(e) =>
                      setDraftTransform((t) => ({ ...t, zoom: parseFloat(e.target.value) }))
                    }
                    className="flex-1 accent-[#68525D]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTransform((t) => ({
                        ...t,
                        zoom: Math.min(2.8, Number((t.zoom + 0.15).toFixed(2))),
                      }))
                    }
                    className="min-w-[40px] min-h-[40px] rounded-xl bg-white border border-[#D9B6C5] flex items-center justify-center cursor-pointer"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#4A3740]">
                    <span>Horizontal Pan</span>
                    <span className="tabular-nums">{Math.round(draftTransform.offsetX * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.05}
                    value={draftTransform.offsetX}
                    onChange={(e) =>
                      setDraftTransform((t) => ({ ...t, offsetX: parseFloat(e.target.value) }))
                    }
                    className="mt-1.5 w-full accent-[#68525D]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#4A3740]">
                    <span>Vertical Pan</span>
                    <span className="tabular-nums">{Math.round(draftTransform.offsetY * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.05}
                    value={draftTransform.offsetY}
                    onChange={(e) =>
                      setDraftTransform((t) => ({ ...t, offsetY: parseFloat(e.target.value) }))
                    }
                    className="mt-1.5 w-full accent-[#68525D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#4A3740]">
                  Rotate ({draftTransform.rotation}°)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTransform((t) => ({
                        ...t,
                        rotation: (t.rotation + 90) % 360,
                      }))
                    }
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-[#D9B6C5] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#FCE7ED] cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>+90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTransform({ zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 })
                    }
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-[#D9B6C5] text-xs font-semibold hover:bg-[#FCE7ED] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-sm font-semibold text-[#4A3740] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCropModal}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#68525D] text-white text-sm font-semibold hover:bg-[#534049] cursor-pointer"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
