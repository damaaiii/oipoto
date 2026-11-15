import React from 'react';
import { PHOTO_LAYOUTS, STUDIOS } from '../data/studios';
import { LayoutId, StudioId } from '../types/photobooth';

interface FrameSelectorProps {
  studioId: StudioId;
  frameId: string;
  layoutId: LayoutId;
  photoCount: number;
  onSelectStudioAndFrame: (studioId: StudioId, frameId: string) => void;
  onSelectLayout: (layoutId: LayoutId) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  studioId,
  frameId,
  layoutId,
  photoCount,
  onSelectStudioAndFrame,
  onSelectLayout,
}) => {
  const currentStudio = STUDIOS.find((s) => s.id === studioId) || STUDIOS[0];

  return (
    <div className="space-y-6">
      {/* Photo Layout */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-sm font-bold text-[#4A3740]">Photo Layout</h3>
          <span className="text-xs text-[#68525D] tabular-nums">
            {photoCount} photo{photoCount === 1 ? '' : 's'} loaded
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
          {PHOTO_LAYOUTS.map((layout) => {
            const active = layout.id === layoutId;
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => onSelectLayout(layout.id)}
                className={`text-left rounded-2xl p-3 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FCE7ED] border-[#68525D] text-[#4A3740]'
                    : 'bg-[#FFF6EC]/60 border-[#D9B6C5]/60 text-[#4A3740] hover:bg-[#FCE7ED]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold truncate">{layout.name}</span>
                  <span className="text-[11px] font-medium text-[#68525D] tabular-nums shrink-0">
                    {layout.slotCount}x
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#68525D] line-clamp-1">
                  {layout.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Studio Collection Switcher */}
      <div>
        <h3 className="text-sm font-bold text-[#4A3740] mb-2.5">Studio Theme</h3>
        <div className="flex flex-wrap gap-1.5">
          {STUDIOS.map((st) => {
            const active = st.id === studioId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStudioAndFrame(st.id, st.frames[0].id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                  active
                    ? 'bg-[#68525D] text-white border-[#68525D]'
                    : 'bg-white text-[#4A3740] border-[#D9B6C5]/70 hover:bg-[#FCE7ED]/50'
                }`}
              >
                {st.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frames in Current Studio */}
      <div>
        <h3 className="text-sm font-bold text-[#4A3740] mb-2.5">
          {currentStudio.name} Frames
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
          {currentStudio.frames.map((frame) => {
            const active = frame.id === frameId;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => onSelectStudioAndFrame(currentStudio.id, frame.id)}
                className={`flex items-center gap-3 text-left rounded-2xl p-3 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FCE7ED] border-[#68525D]'
                    : 'bg-white border-[#D9B6C5]/60 hover:bg-[#FFF6EC]'
                }`}
              >
                <span
                  className="w-10 h-10 rounded-xl border border-[#D9B6C5]/70 shrink-0"
                  style={{
                    background:
                      frame.pattern === 'pop-pastel-gradient'
                        ? 'linear-gradient(135deg, #F6CAD8, #E7DDF3)'
                        : frame.backgroundColor,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#4A3740] truncate">{frame.name}</p>
                  <p className="text-[11px] text-[#68525D] line-clamp-1">{frame.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
