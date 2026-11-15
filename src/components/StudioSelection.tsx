import React from 'react';
import { ArrowRight, Camera, Upload, Users } from 'lucide-react';
import { STUDIOS } from '../data/studios';
import { StudioId } from '../types/photobooth';

interface StudioSelectionProps {
  selectedStudioId: StudioId;
  selectedFrameId: string;
  onSelectStudioAndFrame: (studioId: StudioId, frameId: string) => void;
  onStartCamera: (studioId: StudioId, frameId: string) => void;
  onStartUpload: (studioId: StudioId, frameId: string) => void;
  onStartGroup: (studioId: StudioId, frameId: string) => void;
}

export const StudioSelection: React.FC<StudioSelectionProps> = ({
  selectedStudioId,
  selectedFrameId,
  onSelectStudioAndFrame,
  onStartCamera,
  onStartUpload,
  onStartGroup,
}) => {
  const activeStudio = STUDIOS.find((s) => s.id === selectedStudioId) || STUDIOS[0];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#D9B6C5]/50">
        <div>
          <p className="text-xs font-medium text-[#68525D]">Studio Collection</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#4A3740] text-balance">
            Pick Your Little Photo Studio
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#68525D] max-w-2xl">
            Each studio unlocks custom frame borders, textures, and matching film color tones. Switch any studio or frame later inside the editor too.
          </p>
        </div>
      </div>

      {/* Studio Switcher Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STUDIOS.map((studio) => {
          const isSelected = studio.id === selectedStudioId;
          return (
            <button
              key={studio.id}
              type="button"
              onClick={() => onSelectStudioAndFrame(studio.id, studio.frames[0].id)}
              className={`group text-left rounded-3xl p-3 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-white border-[#68525D] shadow-md'
                  : 'bg-white/75 border-[#D9B6C5]/60 hover:bg-white hover:border-[#68525D]/60'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FCE7ED]">
                {studio.previewImage ? (
                  <img
                    src={studio.previewImage}
                    alt={`${studio.name} photobooth preview`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#F6CAD8] via-[#FCE7ED] to-[#E7DDF3] flex flex-col items-center justify-center p-4 text-center">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-8 rounded bg-white/90 border border-[#68525D]/30 -rotate-6" />
                      <span className="w-6 h-8 rounded bg-white border border-[#68525D]/40 rotate-3" />
                      <span className="w-6 h-8 rounded bg-[#FFF6EC] border border-[#68525D]/30 rotate-12" />
                    </div>
                    <span className="mt-2 text-xs font-bold tracking-tight text-[#4A3740]">
                      Pastel Pop Frames
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 px-1">
                <p className="text-[11px] font-medium text-[#68525D]">{studio.kicker}</p>
                <h2 className="mt-0.5 text-base font-bold text-[#4A3740]">{studio.name}</h2>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Studio Detail & Frame Picker */}
      <div className="mt-8 rounded-3xl bg-white border border-[#D9B6C5]/70 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-[#C84B78]">{activeStudio.kicker}</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3740]">
              {activeStudio.name}
            </h2>
            <p className="mt-2 text-sm text-[#68525D] leading-relaxed">
              {activeStudio.description}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => onStartCamera(activeStudio.id, selectedFrameId)}
                className="inline-flex items-center justify-between min-h-[48px] px-5 py-3 rounded-xl bg-[#68525D] text-white text-sm font-semibold hover:bg-[#534049] transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Camera className="w-4 h-4" />
                  <span>Start Camera Booth</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onStartUpload(activeStudio.id, selectedFrameId)}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FCE7ED] text-[#4A3740] text-sm font-semibold hover:bg-[#F6CAD8] transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photos</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartGroup(activeStudio.id, selectedFrameId)}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#E7DDF3] text-[#4A3740] text-sm font-semibold hover:bg-[#d8c9eb] transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Group Mode</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold text-[#4A3740]">
              Choose a Frame in {activeStudio.name}
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeStudio.frames.map((frame) => {
                const isFrameActive = frame.id === selectedFrameId;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => onSelectStudioAndFrame(activeStudio.id, frame.id)}
                    className={`text-left rounded-2xl p-4 transition-all cursor-pointer border ${
                      isFrameActive
                        ? 'border-[#68525D] bg-[#FFF6EC]'
                        : 'border-[#D9B6C5]/60 bg-white hover:bg-[#FFF6EC]/60'
                    }`}
                  >
                    {/* Mini visual strip representation */}
                    <div
                      className="h-28 w-full rounded-xl p-2.5 flex flex-col justify-between border border-[#D9B6C5]/40"
                      style={{ backgroundColor: frame.backgroundColor }}
                    >
                      <div className="grid grid-cols-2 gap-1.5 flex-1">
                        <div
                          className="rounded-md"
                          style={{ backgroundColor: frame.secondaryColor }}
                        />
                        <div
                          className="rounded-md"
                          style={{ backgroundColor: frame.secondaryColor }}
                        />
                        <div
                          className="rounded-md"
                          style={{ backgroundColor: frame.secondaryColor }}
                        />
                        <div
                          className="rounded-md"
                          style={{ backgroundColor: frame.secondaryColor }}
                        />
                      </div>
                      <span
                        className="mt-1.5 block text-[9px] font-bold tracking-wider truncate text-center"
                        style={{ color: frame.textColor }}
                      >
                        {frame.defaultFooterText}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#4A3740]">{frame.name}</p>
                    <p className="mt-0.5 text-xs text-[#68525D] leading-snug">
                      {frame.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
