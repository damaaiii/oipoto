import React from 'react';
import { Camera, Sparkles, Upload, Users } from 'lucide-react';
import { STUDIOS } from '../data/studios';
import { CapturedPhoto, StudioId } from '../types/photobooth';
import { CameraBooth } from './CameraBooth';
import { GroupMode } from './GroupMode';
import { RandomPose } from './RandomPose';
import { UploadStudio } from './UploadStudio';

export type SessionMode = 'camera' | 'upload' | 'group';

interface PhotoSessionProps {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
  studioId: StudioId;
  frameId: string;
  onSelectStudioAndFrame: (studioId: StudioId, frameId: string) => void;
  photos: CapturedPhoto[];
  targetCount: number;
  onTargetCountChange: (count: number) => void;
  onPhotosChange: (photos: CapturedPhoto[]) => void;
  onProceedToEditor: () => void;
}

export const PhotoSession: React.FC<PhotoSessionProps> = ({
  mode,
  onModeChange,
  studioId,
  frameId,
  onSelectStudioAndFrame,
  photos,
  targetCount,
  onTargetCountChange,
  onPhotosChange,
  onProceedToEditor,
}) => {
  const studio = STUDIOS.find((s) => s.id === studioId) || STUDIOS[0];
  const [showPosePanel, setShowPosePanel] = React.useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Session Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D9B6C5]/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#68525D]">
            <span>{studio.name}</span>
            <span aria-hidden="true">·</span>
            <span>{studio.kicker}</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3740]">
            {mode === 'camera'
              ? 'Photobooth Camera'
              : mode === 'upload'
                ? 'Upload Studio'
                : 'Group Photo Booth'}
          </h1>
        </div>

        {/* Segmented Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white border border-[#D9B6C5]/70"
            role="tablist"
            aria-label="Capture mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'camera'}
              onClick={() => onModeChange('camera')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'camera'
                  ? 'bg-[#68525D] text-white'
                  : 'text-[#68525D] hover:text-[#4A3740]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'upload'}
              onClick={() => onModeChange('upload')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'upload'
                  ? 'bg-[#68525D] text-white'
                  : 'text-[#68525D] hover:text-[#4A3740]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'group'}
              onClick={() => onModeChange('group')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'group'
                  ? 'bg-[#68525D] text-white'
                  : 'text-[#68525D] hover:text-[#4A3740]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Group Mode</span>
            </button>
          </div>

          {mode !== 'group' && (
            <button
              type="button"
              onClick={() => setShowPosePanel((v) => !v)}
              className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showPosePanel
                  ? 'bg-[#FCE7ED] border-[#68525D] text-[#4A3740]'
                  : 'bg-white border-[#D9B6C5] text-[#4A3740] hover:bg-[#FCE7ED]/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showPosePanel ? 'Hide Pose Ideas' : 'Random Pose'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Pose Generator Drawer */}
      {showPosePanel && mode !== 'group' && (
        <div className="mt-6">
          <RandomPose compact />
        </div>
      )}

      {/* Active Mode Content */}
      <div className="mt-6">
        {mode === 'camera' && (
          <CameraBooth
            photos={photos}
            targetCount={targetCount}
            onTargetCountChange={onTargetCountChange}
            onPhotosChange={onPhotosChange}
            onSwitchToUpload={() => onModeChange('upload')}
            onProceedToEditor={onProceedToEditor}
          />
        )}
        {mode === 'upload' && (
          <UploadStudio
            photos={photos}
            onPhotosChange={onPhotosChange}
            onProceedToEditor={onProceedToEditor}
          />
        )}
        {mode === 'group' && (
          <GroupMode
            studioId={studioId}
            frameId={frameId}
            photos={photos}
            targetCount={targetCount}
            onTargetCountChange={onTargetCountChange}
            onSelectStudioAndFrame={onSelectStudioAndFrame}
            onPhotosChange={onPhotosChange}
            onSwitchToUpload={() => onModeChange('upload')}
            onProceedToEditor={onProceedToEditor}
          />
        )}
      </div>
    </section>
  );
};
