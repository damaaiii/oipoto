import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Frame,
  Sliders,
  Smile,
  Type,
} from 'lucide-react';
import { getFrameById, getLayoutById, STICKER_LIBRARY } from '../data/studios';
import {
  FilterId,
  LayoutId,
  PhotoAdjustments,
  PhotoboothProjectState,
  PlacedSticker,
  PlacedText,
  StudioId,
} from '../types/photobooth';
import {
  getCanvasDimensions,
  renderPhotoboothToCanvas,
} from '../utils/canvasRenderer';
import { StickerPreviewIcon } from '../utils/stickerArtwork';
import { DownloadManager } from './DownloadManager';
import { FilterSelector } from './FilterSelector';
import { FrameSelector } from './FrameSelector';
import { StickerEditor } from './StickerEditor';
import { TextEditor } from './TextEditor';

interface PhotoEditorProps {
  project: PhotoboothProjectState;
  onChangeProject: React.Dispatch<React.SetStateAction<PhotoboothProjectState>>;
  onBackToCapture: () => void;
  onCreateAnother: () => void;
  onGalleryUpdated: () => void;
}

type EditorTab = 'frames' | 'filters' | 'stickers' | 'text' | 'export';

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  project,
  onChangeProject,
  onBackToCapture,
  onCreateAnother,
  onGalleryUpdated,
}) => {
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<EditorTab>('frames');
  const [selectedStickerUid, setSelectedStickerUid] = useState<string | null>(null);
  const [selectedTextUid, setSelectedTextUid] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const [draggingItem, setDraggingItem] = useState<{
    kind: 'sticker' | 'text';
    uid: string;
  } | null>(null);

  const layout = getLayoutById(project.layoutId);
  const dims = getCanvasDimensions(layout.id);

  // Render base frame + filtered photos + footer (without floating stickers/text, which are interactive DOM overlays during editing)
  useEffect(() => {
    let cancelled = false;
    const renderBase = async () => {
      if (!baseCanvasRef.current) return;
      setIsRendering(true);
      await renderPhotoboothToCanvas(
        {
          ...project,
          stickers: [],
          texts: [],
        },
        baseCanvasRef.current,
        0.55
      );
      if (!cancelled) {
        setIsRendering(false);
      }
    };
    renderBase();
    return () => {
      cancelled = true;
    };
  }, [
    project.studioId,
    project.frameId,
    project.layoutId,
    project.filterId,
    project.adjustments,
    project.photos,
    project.showDateStamp,
    project.customDateText,
    project.footerCaption,
  ]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingItem || !previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const nx = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(0.95, Math.max(0.05, (e.clientY - rect.top) / rect.height));

    if (draggingItem.kind === 'sticker') {
      onChangeProject((prev) => ({
        ...prev,
        stickers: prev.stickers.map((s) =>
          s.uid === draggingItem.uid ? { ...s, x: nx, y: ny } : s
        ),
      }));
    } else {
      onChangeProject((prev) => ({
        ...prev,
        texts: prev.texts.map((t) =>
          t.uid === draggingItem.uid ? { ...t, x: nx, y: ny } : t
        ),
      }));
    }
  };

  const handleSelectStudioAndFrame = (studioId: StudioId, frameId: string) => {
    const newFrame = getFrameById(frameId);
    onChangeProject((prev) => ({
      ...prev,
      studioId,
      frameId,
      footerCaption: newFrame.defaultFooterText,
    }));
  };

  const handleSelectLayout = (layoutId: LayoutId) => {
    onChangeProject((prev) => ({ ...prev, layoutId }));
  };

  const handleFilterChange = (filterId: FilterId) => {
    onChangeProject((prev) => ({ ...prev, filterId }));
  };

  const handleAdjustmentsChange = (adjustments: PhotoAdjustments) => {
    onChangeProject((prev) => ({ ...prev, adjustments }));
  };

  const handleAddSticker = (stickerId: string) => {
    const uid = `stk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newSticker: PlacedSticker = {
      uid,
      stickerId,
      x: 0.5,
      y: 0.45,
      scale: 1,
      rotation: 0,
    };
    onChangeProject((prev) => ({
      ...prev,
      stickers: [...prev.stickers, newSticker],
    }));
    setSelectedStickerUid(uid);
    setSelectedTextUid(null);
  };

  const handleUpdateSticker = (uid: string, patch: Partial<PlacedSticker>) => {
    onChangeProject((prev) => ({
      ...prev,
      stickers: prev.stickers.map((s) => (s.uid === uid ? { ...s, ...patch } : s)),
    }));
  };

  const handleRemoveSticker = (uid: string) => {
    onChangeProject((prev) => ({
      ...prev,
      stickers: prev.stickers.filter((s) => s.uid !== uid),
    }));
    if (selectedStickerUid === uid) setSelectedStickerUid(null);
  };

  const handleAddText = () => {
    const uid = `txt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newText: PlacedText = {
      uid,
      text: 'best day ever',
      x: 0.5,
      y: 0.5,
      fontSize: 32,
      color: '#4A3740',
      font: 'handwriting',
      align: 'center',
    };
    onChangeProject((prev) => ({
      ...prev,
      texts: [...prev.texts, newText],
    }));
    setSelectedTextUid(uid);
    setSelectedStickerUid(null);
    setActiveTab('text');
  };

  const handleUpdateText = (uid: string, patch: Partial<PlacedText>) => {
    onChangeProject((prev) => ({
      ...prev,
      texts: prev.texts.map((t) => (t.uid === uid ? { ...t, ...patch } : t)),
    }));
  };

  const handleRemoveText = (uid: string) => {
    onChangeProject((prev) => ({
      ...prev,
      texts: prev.texts.filter((t) => t.uid !== uid),
    }));
    if (selectedTextUid === uid) setSelectedTextUid(null);
  };

  const TABS: Array<{ id: EditorTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'frames', label: 'Frames', icon: Frame },
    { id: 'filters', label: 'Filters', icon: Sliders },
    { id: 'stickers', label: 'Stickers', icon: Smile },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'export', label: 'Download', icon: Download },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#D9B6C5]/50">
        <button
          type="button"
          onClick={onBackToCapture}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-[#4A3740] text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Photos</span>
        </button>

        <div className="text-center hidden sm:block">
          <p className="text-xs font-medium text-[#68525D]">Studio Editor</p>
          <h1 className="text-lg font-extrabold text-[#4A3740]">Customize Your Strip</h1>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className="min-h-[44px] px-5 py-2 rounded-xl bg-[#68525D] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#534049] transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Save & Download</span>
        </button>
      </div>

      {/* Main Split Editor */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Interactive Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-3xl bg-[#FCE7ED]/45 border border-[#D9B6C5]/60 p-4 sm:p-8 min-h-[420px]">
          <div
            ref={previewContainerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDraggingItem(null)}
            onPointerLeave={() => setDraggingItem(null)}
            onClick={(e) => {
              if (e.target === previewContainerRef.current || e.target === baseCanvasRef.current) {
                setSelectedStickerUid(null);
                setSelectedTextUid(null);
              }
            }}
            className="relative select-none touch-none shadow-[0_18px_45px_rgba(74,55,64,0.14)] rounded-lg overflow-hidden bg-white"
            style={{
              aspectRatio: `${dims.width} / ${dims.height}`,
              width: dims.width / dims.height < 0.55 ? 'min(100%, 300px)' : 'min(100%, 440px)',
            }}
          >
            <canvas
              ref={baseCanvasRef}
              className="w-full h-full block"
            />

            {/* Interactive Sticker Overlays */}
            {project.stickers.map((stk) => {
              const def = STICKER_LIBRARY.find((s) => s.id === stk.stickerId);
              if (!def) return null;
              const isSelected = stk.uid === selectedStickerUid;
              return (
                <div
                  key={stk.uid}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    setSelectedStickerUid(stk.uid);
                    setSelectedTextUid(null);
                    setDraggingItem({ kind: 'sticker', uid: stk.uid });
                    setActiveTab('stickers');
                  }}
                  style={{
                    left: `${stk.x * 100}%`,
                    top: `${stk.y * 100}%`,
                    transform: `translate(-50%, -50%) scale(${stk.scale}) rotate(${stk.rotation}deg)`,
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing rounded-xl p-1 ${
                    isSelected ? 'ring-2 ring-[#C84B78] bg-white/30' : ''
                  }`}
                >
                  <StickerPreviewIcon
                    drawType={def.drawType}
                    className="w-11 h-11 sm:w-12 sm:h-12 pointer-events-none"
                  />
                </div>
              );
            })}

            {/* Interactive Floating Text Overlays */}
            {project.texts.map((t) => {
              const isSelected = t.uid === selectedTextUid;
              const fontClass =
                t.font === 'handwriting'
                  ? 'font-handwriting'
                  : t.font === 'mono'
                    ? 'font-mono-stamp'
                    : t.font === 'display'
                      ? 'font-display'
                      : '';
              return (
                <div
                  key={t.uid}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    setSelectedTextUid(t.uid);
                    setSelectedStickerUid(null);
                    setDraggingItem({ kind: 'text', uid: t.uid });
                    setActiveTab('text');
                  }}
                  style={{
                    left: `${t.x * 100}%`,
                    top: `${t.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    color: t.color,
                    fontSize: `${Math.max(12, Math.round(t.fontSize * 0.48))}px`,
                    textAlign: t.align,
                    textShadow:
                      t.color.toLowerCase() === '#ffffff'
                        ? '0 1px 4px rgba(74,55,64,0.8)'
                        : '0 1px 4px rgba(255,255,255,0.92)',
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing font-bold whitespace-nowrap px-2 py-0.5 rounded-lg ${fontClass} ${
                    isSelected ? 'ring-2 ring-[#C84B78] bg-white/30' : ''
                  }`}
                >
                  {t.text || 'Text'}
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-[#68525D]">
            {isRendering
              ? 'Updating studio preview...'
              : 'Tip: Drag placed stickers or text directly on the strip.'}
          </p>
        </div>

        {/* Right: Tabbed Studio Tool Drawer */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#D9B6C5]/70 overflow-hidden">
          {/* Tool Tabs */}
          <div
            className="grid grid-cols-5 border-b border-[#D9B6C5]/50 bg-[#FFF6EC]/70"
            role="tablist"
            aria-label="Photo editor tools"
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(id)}
                  className={`min-h-[54px] px-1 py-2 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-[#4A3740] border-b-2 border-[#C84B78]'
                      : 'text-[#68525D] hover:text-[#4A3740]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate max-w-full">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-6 max-h-[640px] overflow-y-auto">
            {activeTab === 'frames' && (
              <FrameSelector
                studioId={project.studioId}
                frameId={project.frameId}
                layoutId={project.layoutId}
                photoCount={project.photos.length}
                onSelectStudioAndFrame={handleSelectStudioAndFrame}
                onSelectLayout={handleSelectLayout}
              />
            )}

            {activeTab === 'filters' && (
              <FilterSelector
                filterId={project.filterId}
                adjustments={project.adjustments}
                samplePhotoUrl={project.photos[0]?.dataUrl}
                onFilterChange={handleFilterChange}
                onAdjustmentsChange={handleAdjustmentsChange}
              />
            )}

            {activeTab === 'stickers' && (
              <StickerEditor
                stickers={project.stickers}
                selectedStickerUid={selectedStickerUid}
                onAddSticker={handleAddSticker}
                onSelectSticker={setSelectedStickerUid}
                onUpdateSticker={handleUpdateSticker}
                onRemoveSticker={handleRemoveSticker}
              />
            )}

            {activeTab === 'text' && (
              <TextEditor
                texts={project.texts}
                selectedTextUid={selectedTextUid}
                footerCaption={project.footerCaption}
                showDateStamp={project.showDateStamp}
                customDateText={project.customDateText}
                onAddText={handleAddText}
                onUpdateText={handleUpdateText}
                onRemoveText={handleRemoveText}
                onFooterCaptionChange={(footerCaption) =>
                  onChangeProject((prev) => ({ ...prev, footerCaption }))
                }
                onShowDateStampChange={(showDateStamp) =>
                  onChangeProject((prev) => ({ ...prev, showDateStamp }))
                }
                onCustomDateTextChange={(customDateText) =>
                  onChangeProject((prev) => ({ ...prev, customDateText }))
                }
              />
            )}

            {activeTab === 'export' && (
              <DownloadManager
                project={project}
                onCreateAnother={onCreateAnother}
                onSavedToGallery={onGalleryUpdated}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
