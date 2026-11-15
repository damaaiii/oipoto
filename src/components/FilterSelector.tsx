import React from 'react';
import { RotateCcw } from 'lucide-react';
import { DEFAULT_ADJUSTMENTS, PHOTO_FILTERS } from '../data/studios';
import { FilterId, PhotoAdjustments } from '../types/photobooth';

interface FilterSelectorProps {
  filterId: FilterId;
  adjustments: PhotoAdjustments;
  samplePhotoUrl?: string;
  onFilterChange: (filterId: FilterId) => void;
  onAdjustmentsChange: (adjustments: PhotoAdjustments) => void;
}

const ADJUSTMENT_SLIDERS: Array<{
  key: keyof PhotoAdjustments;
  label: string;
}> = [
  { key: 'brightness', label: 'Brightness' },
  { key: 'contrast', label: 'Contrast' },
  { key: 'saturation', label: 'Saturation' },
  { key: 'warmth', label: 'Warmth' },
  { key: 'exposure', label: 'Exposure' },
];

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterId,
  adjustments,
  samplePhotoUrl,
  onFilterChange,
  onAdjustmentsChange,
}) => {
  const hasCustomAdjustments = Object.values(adjustments).some((v) => v !== 0);

  return (
    <div className="space-y-6">
      {/* Filter Presets */}
      <div>
        <h3 className="text-sm font-bold text-[#4A3740] mb-2.5">Photo Filters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-2 gap-2">
          {PHOTO_FILTERS.map((filter) => {
            const active = filter.id === filterId;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`flex items-center gap-2.5 rounded-2xl p-2 border text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FCE7ED] border-[#68525D]'
                    : 'bg-white border-[#D9B6C5]/60 hover:bg-[#FFF6EC]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-[#D9B6C5]/50 bg-[#FFF6EC]">
                  {samplePhotoUrl ? (
                    <img
                      src={samplePhotoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ filter: filter.cssPreview }}
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: filter.swatchColor }}
                    />
                  )}
                </div>
                <span className="text-xs font-semibold text-[#4A3740] truncate">
                  {filter.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone Adjustments */}
      <div className="pt-4 border-t border-[#D9B6C5]/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-[#4A3740]">Fine Adjustments</h3>
          {hasCustomAdjustments && (
            <button
              type="button"
              onClick={() => onAdjustmentsChange({ ...DEFAULT_ADJUSTMENTS })}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C84B78] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-3.5">
          {ADJUSTMENT_SLIDERS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between text-xs font-medium text-[#4A3740]">
                <label htmlFor={`adj-${key}`}>{label}</label>
                <span className="tabular-nums text-[#68525D]">
                  {adjustments[key] > 0 ? `+${adjustments[key]}` : adjustments[key]}
                </span>
              </div>
              <input
                id={`adj-${key}`}
                type="range"
                min={-50}
                max={50}
                step={2}
                value={adjustments[key]}
                onChange={(e) =>
                  onAdjustmentsChange({
                    ...adjustments,
                    [key]: parseInt(e.target.value, 10),
                  })
                }
                className="mt-1 w-full accent-[#68525D] cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
