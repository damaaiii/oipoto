import React from 'react';
import { Users } from 'lucide-react';
import { STUDIOS } from '../data/studios';
import { CapturedPhoto, StudioId } from '../types/photobooth';
import { CameraBooth } from './CameraBooth';
import { RandomPose } from './RandomPose';

interface GroupModeProps {
  studioId: StudioId;
  frameId: string;
  photos: CapturedPhoto[];
  targetCount: number;
  onTargetCountChange: (count: number) => void;
  onSelectStudioAndFrame: (studioId: StudioId, frameId: string) => void;
  onPhotosChange: (photos: CapturedPhoto[]) => void;
  onSwitchToUpload: () => void;
  onProceedToEditor: () => void;
}

export const GroupMode: React.FC<GroupModeProps> = ({
  studioId,
  frameId,
  photos,
  targetCount,
  onTargetCountChange,
  onSelectStudioAndFrame,
  onPhotosChange,
  onSwitchToUpload,
  onProceedToEditor,
}) => {
  const activeStudio = STUDIOS.find((s) => s.id === studioId) || STUDIOS[0];

  return (
    <div className="space-y-6">
      {/* Group Booth Banner & Shared Frame Selector */}
      <div className="rounded-3xl bg-[#E7DDF3]/55 border border-[#D9B6C5]/70 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#D9B6C5] flex items-center justify-center text-[#68525D] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#4A3740]">
                Group Photo Mode (Single-Device Booth)
              </h2>
              <p className="mt-0.5 text-sm text-[#68525D]">
                Gather your friends around one camera! Pick a shared frame together, roll a group pose prompt, and use the 5s or 10s timer to get everyone in frame.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="group-studio-select" className="text-xs font-semibold text-[#4A3740]">
              Shared Frame:
            </label>
            <select
              id="group-studio-select"
              value={frameId}
              onChange={(e) => {
                const newFrameId = e.target.value;
                const studio = STUDIOS.find((s) =>
                  s.frames.some((f) => f.id === newFrameId)
                );
                if (studio) {
                  onSelectStudioAndFrame(studio.id, newFrameId);
                }
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#D9B6C5] text-sm font-medium text-[#4A3740] cursor-pointer"
            >
              {STUDIOS.map((st) => (
                <optgroup key={st.id} label={st.name}>
                  {st.frames.map((fr) => (
                    <option key={fr.id} value={fr.id}>
                      {st.name} — {fr.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2.5 text-xs text-[#68525D]">
          Current shared studio: <strong className="text-[#4A3740]">{activeStudio.name}</strong> · All shots save locally on this device so everyone can review and download together.
        </p>
      </div>

      {/* Group Pose Prompt */}
      <RandomPose defaultCategory="Group Pose" compact />

      {/* Camera Booth configured for Group sessions */}
      <CameraBooth
        photos={photos}
        targetCount={targetCount}
        onTargetCountChange={onTargetCountChange}
        onPhotosChange={onPhotosChange}
        onSwitchToUpload={onSwitchToUpload}
        onProceedToEditor={onProceedToEditor}
        groupFriendly
      />
    </div>
  );
};
