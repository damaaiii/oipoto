import React from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Calendar,
  Plus,
  Trash2,
} from 'lucide-react';
import { PlacedText, TextFontFamily } from '../types/photobooth';

interface TextEditorProps {
  texts: PlacedText[];
  selectedTextUid: string | null;
  footerCaption: string;
  showDateStamp: boolean;
  customDateText: string;
  onAddText: () => void;
  onUpdateText: (uid: string, patch: Partial<PlacedText>) => void;
  onRemoveText: (uid: string) => void;
  onFooterCaptionChange: (val: string) => void;
  onShowDateStampChange: (val: boolean) => void;
  onCustomDateTextChange: (val: string) => void;
}

const COLOR_SWATCHES = [
  '#4A3740',
  '#FFFFFF',
  '#C84B78',
  '#7B66A6',
  '#C96A3B',
  '#251F1D',
];

const FONT_OPTIONS: Array<{ id: TextFontFamily; label: string }> = [
  { id: 'sans', label: 'Modern' },
  { id: 'display', label: 'Bold' },
  { id: 'handwriting', label: 'Handwritten' },
  { id: 'mono', label: 'Stamp Mono' },
];

export const TextEditor: React.FC<TextEditorProps> = ({
  texts,
  selectedTextUid,
  footerCaption,
  showDateStamp,
  customDateText,
  onAddText,
  onUpdateText,
  onRemoveText,
  onFooterCaptionChange,
  onShowDateStampChange,
  onCustomDateTextChange,
}) => {
  const selected = texts.find((t) => t.uid === selectedTextUid) || null;

  return (
    <div className="space-y-6">
      {/* Strip Footer Caption & Date Stamp */}
      <div className="space-y-3 pb-5 border-b border-[#D9B6C5]/40">
        <h3 className="text-sm font-bold text-[#4A3740]">Strip Caption & Date</h3>

        <div>
          <label htmlFor="footer-caption-input" className="block text-xs font-medium text-[#68525D] mb-1">
            Footer Caption
          </label>
          <input
            id="footer-caption-input"
            type="text"
            maxLength={40}
            value={footerCaption}
            onChange={(e) => onFooterCaptionChange(e.target.value)}
            placeholder="Besties Day Out!"
            className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FFF6EC] border border-[#D9B6C5] text-sm text-[#4A3740] focus:outline-none focus:border-[#68525D]"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <label
            htmlFor="date-stamp-toggle"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A3740] cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#C84B78]" />
            <span>Show Date Stamp</span>
          </label>
          <button
            id="date-stamp-toggle"
            type="button"
            role="switch"
            aria-checked={showDateStamp}
            onClick={() => onShowDateStampChange(!showDateStamp)}
            className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              showDateStamp
                ? 'bg-[#68525D] text-white'
                : 'bg-[#FFF6EC] text-[#68525D] border border-[#D9B6C5]'
            }`}
          >
            {showDateStamp ? 'ON' : 'OFF'}
          </button>
        </div>

        {showDateStamp && (
          <div>
            <label htmlFor="custom-date-input" className="block text-xs font-medium text-[#68525D] mb-1">
              Custom Date Text
            </label>
            <input
              id="custom-date-input"
              type="text"
              maxLength={24}
              value={customDateText}
              onChange={(e) => onCustomDateTextChange(e.target.value)}
              placeholder="Nov 15, 2026"
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FFF6EC] border border-[#D9B6C5] text-sm font-mono-stamp text-[#4A3740] focus:outline-none focus:border-[#68525D]"
            />
          </div>
        )}
      </div>

      {/* Floating Custom Text Layers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#4A3740]">Floating Photo Text</h3>
            <p className="text-xs text-[#68525D]">Drag text anywhere on your strip.</p>
          </div>
          <button
            type="button"
            onClick={onAddText}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#68525D] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#534049] transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Text</span>
          </button>
        </div>

        {selected ? (
          <div className="rounded-2xl bg-[#FCE7ED]/70 border border-[#D9B6C5] p-4 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#4A3740]">Edit Selected Text</span>
              <button
                type="button"
                onClick={() => onRemoveText(selected.uid)}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white text-[#C84B78] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            <input
              type="text"
              maxLength={60}
              value={selected.text}
              onChange={(e) => onUpdateText(selected.uid, { text: e.target.value })}
              placeholder="Write your note..."
              className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#D9B6C5] text-sm text-[#4A3740]"
            />

            {/* Font picker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onUpdateText(selected.uid, { font: f.id })}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selected.font === f.id
                      ? 'bg-[#68525D] text-white'
                      : 'bg-white text-[#4A3740] border border-[#D9B6C5]/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Size slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-[#4A3740]">
                <span>Text Size</span>
                <span className="tabular-nums">{selected.fontSize}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={64}
                step={2}
                value={selected.fontSize}
                onChange={(e) =>
                  onUpdateText(selected.uid, { fontSize: parseInt(e.target.value, 10) })
                }
                className="mt-1 w-full accent-[#68525D]"
              />
            </div>

            {/* Alignment & Colors */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9B6C5]/60">
                {(
                  [
                    { id: 'left', icon: AlignLeft },
                    { id: 'center', icon: AlignCenter },
                    { id: 'right', icon: AlignRight },
                  ] as const
                ).map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onUpdateText(selected.uid, { align: id })}
                    className={`min-w-[34px] min-h-[34px] rounded-lg flex items-center justify-center cursor-pointer ${
                      selected.align === id
                        ? 'bg-[#FCE7ED] text-[#4A3740]'
                        : 'text-[#68525D]'
                    }`}
                    aria-label={`Align ${id}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onUpdateText(selected.uid, { color: hex })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      selected.color === hex
                        ? 'border-[#68525D] scale-110'
                        : 'border-[#D9B6C5]'
                    }`}
                    style={{ backgroundColor: hex }}
                    aria-label={`Select color ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#68525D]">
            {texts.length === 0
              ? 'Click "Add Text" to place custom notes or greetings directly on your creation.'
              : 'Tap any floating text on the preview canvas to style or edit it.'}
          </p>
        )}
      </div>
    </div>
  );
};
