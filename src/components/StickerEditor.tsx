import React, { useState } from 'react';
import { RotateCw, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { STICKER_LIBRARY } from '../data/studios';
import { PlacedSticker, StickerCategory } from '../types/photobooth';
import { StickerPreviewIcon } from '../utils/stickerArtwork';

interface StickerEditorProps {
  stickers: PlacedSticker[];
  selectedStickerUid: string | null;
  onAddSticker: (stickerId: string) => void;
  onSelectSticker: (uid: string | null) => void;
  onUpdateSticker: (uid: string, patch: Partial<PlacedSticker>) => void;
  onRemoveSticker: (uid: string) => void;
}

const CATEGORIES: Array<{ id: StickerCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'hearts', label: 'Hearts' },
  { id: 'stars', label: 'Stars' },
  { id: 'flowers', label: 'Flowers' },
  { id: 'ribbons', label: 'Ribbons' },
  { id: 'bows', label: 'Bows' },
  { id: 'cherries', label: 'Cherries' },
  { id: 'butterflies', label: 'Butterflies' },
  { id: 'doodles', label: 'Doodles' },
  { id: 'cute', label: 'Cute' },
];

export const StickerEditor: React.FC<StickerEditorProps> = ({
  stickers,
  selectedStickerUid,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker,
}) => {
  const [category, setCategory] = useState<StickerCategory | 'all'>('all');

  const filtered =
    category === 'all'
      ? STICKER_LIBRARY
      : STICKER_LIBRARY.filter((s) => s.category === category);

  const selected = stickers.find((s) => s.uid === selectedStickerUid) || null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-[#4A3740]">Tap to Add Sticker</h3>
        <p className="text-xs text-[#68525D] mt-0.5">
          Drag stickers directly on your photo strip to position them.
        </p>

        {/* Category tabs */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat.id
                  ? 'bg-[#68525D] text-white'
                  : 'bg-[#FFF6EC] text-[#68525D] hover:bg-[#FCE7ED]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sticker Grid */}
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
          {filtered.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onAddSticker(st.id)}
              className="rounded-2xl bg-[#FFF6EC] border border-[#D9B6C5]/60 p-2 flex flex-col items-center justify-center gap-1 hover:bg-[#FCE7ED] hover:border-[#68525D] transition-colors cursor-pointer"
              title={`Add ${st.label}`}
            >
              <StickerPreviewIcon drawType={st.drawType} className="w-10 h-10" />
              <span className="text-[10px] font-medium text-[#4A3740] truncate w-full text-center">
                {st.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Sticker Transform Controls */}
      {selected ? (
        <div className="rounded-2xl bg-[#FCE7ED]/70 border border-[#D9B6C5] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#4A3740]">Selected Sticker</span>
            <button
              type="button"
              onClick={() => onRemoveSticker(selected.uid)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white text-[#C84B78] text-xs font-semibold inline-flex items-center gap-1 hover:bg-[#FCE7ED] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[#4A3740]">
              <span className="inline-flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5" /> Size
              </span>
              <span className="tabular-nums">{selected.scale.toFixed(2)}x</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateSticker(selected.uid, {
                    scale: Math.max(0.4, Number((selected.scale - 0.15).toFixed(2))),
                  })
                }
                className="min-w-[36px] min-h-[36px] rounded-lg bg-white border border-[#D9B6C5] flex items-center justify-center cursor-pointer"
                aria-label="Smaller sticker"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min={0.4}
                max={2.4}
                step={0.05}
                value={selected.scale}
                onChange={(e) =>
                  onUpdateSticker(selected.uid, { scale: parseFloat(e.target.value) })
                }
                className="flex-1 accent-[#68525D]"
              />
              <button
                type="button"
                onClick={() =>
                  onUpdateSticker(selected.uid, {
                    scale: Math.min(2.4, Number((selected.scale + 0.15).toFixed(2))),
                  })
                }
                className="min-w-[36px] min-h-[36px] rounded-lg bg-white border border-[#D9B6C5] flex items-center justify-center cursor-pointer"
                aria-label="Larger sticker"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[#4A3740]">
              <span className="inline-flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Rotation
              </span>
              <span className="tabular-nums">{selected.rotation}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={5}
              value={selected.rotation}
              onChange={(e) =>
                onUpdateSticker(selected.uid, { rotation: parseInt(e.target.value, 10) })
              }
              className="mt-1 w-full accent-[#68525D]"
            />
          </div>
        </div>
      ) : (
        stickers.length > 0 && (
          <p className="text-xs text-[#68525D]">
            Tap any placed sticker on the preview to resize, rotate, or delete it.
          </p>
        )
      )}
    </div>
  );
};
