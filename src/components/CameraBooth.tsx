import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  FlipHorizontal2,
  RefreshCw,
  RotateCcw,
  SwitchCamera,
  Timer,
  Upload,
  VideoOff,
  Check,
} from 'lucide-react';
import { CapturedPhoto } from '../types/photobooth';

interface CameraBoothProps {
  photos: CapturedPhoto[];
  targetCount: number;
  onTargetCountChange: (count: number) => void;
  onPhotosChange: (photos: CapturedPhoto[]) => void;
  onSwitchToUpload: () => void;
  onProceedToEditor: () => void;
  groupFriendly?: boolean;
}

type CameraErrorKind =
  | 'insecure'
  | 'unsupported'
  | 'denied'
  | 'not-found'
  | 'in-use'
  | 'unknown'
  | null;

export const CameraBooth: React.FC<CameraBoothProps> = ({
  photos,
  targetCount,
  onTargetCountChange,
  onPhotosChange,
  onSwitchToUpload,
  onProceedToEditor,
  groupFriendly = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionAbortRef = useRef(false);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [mirrorPreview, setMirrorPreview] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState<3 | 5 | 10>(groupFriendly ? 5 : 3);
  const [cameraState, setCameraState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorKind, setErrorKind] = useState<CameraErrorKind>(null);
  const [errorDetail, setErrorDetail] = useState('');

  const [isCapturingSession, setIsCapturingSession] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [flashActive, setFlashActive] = useState(false);
  const [retakingIndex, setRetakingIndex] = useState<number | null>(null);

  const stopStream = useCallback(() => {
    sessionAbortRef.current = true;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async (mode: 'user' | 'environment') => {
      stopStream();
      setCameraState('loading');
      setErrorKind(null);
      setErrorDetail('');

      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      if (!window.isSecureContext && !isLocalhost) {
        setCameraState('error');
        setErrorKind('insecure');
        setErrorDetail('Camera access requires an HTTPS connection.');
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('error');
        setErrorKind('unsupported');
        setErrorDetail('This browser does not support camera capture via MediaDevices.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        // Check if multiple video inputs exist
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        } catch {
          setHasMultipleCameras(false);
        }

        setCameraState('ready');
      } catch (err: unknown) {
        const name = err instanceof DOMException ? err.name : '';
        setCameraState('error');

        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setErrorKind('denied');
          setErrorDetail('Camera permission was denied. Please allow camera access in browser settings.');
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          setErrorKind('not-found');
          setErrorDetail('No camera device was detected on this device.');
        } else if (name === 'NotReadableError' || name === 'TrackStartError') {
          setErrorKind('in-use');
          setErrorDetail('Your camera is currently being used by another application.');
        } else {
          setErrorKind('unknown');
          setErrorDetail('Could not start the camera stream.');
        }
      }
    },
    [stopStream]
  );

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopStream();
    };
  }, [facingMode, startCamera, stopStream]);

  const captureFrameFromVideo = useCallback((): CapturedPhoto | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || video.videoWidth === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.save();
    if (mirrorPreview && facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    return {
      id: `cam_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      dataUrl,
      source: 'camera',
      transform: {
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
      },
    };
  }, [facingMode, mirrorPreview]);

  const waitWithCountdown = (seconds: number): Promise<boolean> => {
    return new Promise((resolve) => {
      let remaining = seconds;
      setCountdownValue(remaining);

      const interval = window.setInterval(() => {
        if (sessionAbortRef.current) {
          window.clearInterval(interval);
          setCountdownValue(null);
          resolve(false);
          return;
        }
        remaining -= 1;
        if (remaining <= 0) {
          window.clearInterval(interval);
          setCountdownValue(null);
          resolve(true);
        } else {
          setCountdownValue(remaining);
        }
      }, 1000);
    });
  };

  const triggerShutterFlash = () => {
    setFlashActive(true);
    window.setTimeout(() => setFlashActive(false), 220);
  };

  const handleStartSession = async () => {
    if (cameraState !== 'ready' || isCapturingSession) return;
    sessionAbortRef.current = false;
    setIsCapturingSession(true);
    const collected: CapturedPhoto[] = [];
    onPhotosChange([]);

    for (let i = 0; i < targetCount; i++) {
      if (sessionAbortRef.current) break;
      setCurrentShotIndex(i + 1);

      const ok = await waitWithCountdown(countdownSeconds);
      if (!ok || sessionAbortRef.current) break;

      const shot = captureFrameFromVideo();
      triggerShutterFlash();
      if (shot) {
        collected.push(shot);
        onPhotosChange([...collected]);
      }

      if (i < targetCount - 1) {
        await new Promise((r) => setTimeout(r, 650));
      }
    }

    setIsCapturingSession(false);
    setCountdownValue(null);
    setCurrentShotIndex(0);
  };

  const handleRetakeSingle = async (slotIdx: number) => {
    if (cameraState !== 'ready' || isCapturingSession) return;
    sessionAbortRef.current = false;
    setIsCapturingSession(true);
    setRetakingIndex(slotIdx);
    setCurrentShotIndex(slotIdx + 1);

    const ok = await waitWithCountdown(countdownSeconds);
    if (ok && !sessionAbortRef.current) {
      const shot = captureFrameFromVideo();
      triggerShutterFlash();
      if (shot) {
        const next = [...photos];
        next[slotIdx] = shot;
        onPhotosChange(next);
      }
    }

    setRetakingIndex(null);
    setIsCapturingSession(false);
    setCountdownValue(null);
    setCurrentShotIndex(0);
  };

  const handleToggleCamera = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    setMirrorPreview(next === 'user');
  };

  const getErrorHeadline = () => {
    switch (errorKind) {
      case 'denied':
        return 'Camera Permission Denied';
      case 'not-found':
        return 'No Camera Found';
      case 'in-use':
        return 'Camera Busy in Another App';
      case 'insecure':
        return 'HTTPS Required for Camera';
      case 'unsupported':
        return 'Camera Not Supported';
      default:
        return 'Camera Unavailable';
    }
  };

  const isSessionComplete = photos.length >= targetCount && !isCapturingSession;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Live Viewfinder & Controls */}
      <div className="lg:col-span-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#2B2025] border border-[#D9B6C5] aspect-[4/3] sm:aspect-[16/11] w-full flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-transform duration-200 ${
              mirrorPreview ? '-scale-x-100' : ''
            } ${cameraState === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Shutter flash */}
          {flashActive && (
            <div className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-150" />
          )}

          {/* Countdown overlay */}
          {countdownValue !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#4A3740]/25 backdrop-blur-[1px] pointer-events-none">
              <span className="text-sm font-semibold px-3 py-1 rounded-lg bg-white/90 text-[#4A3740] mb-3">
                Shot {currentShotIndex} of {targetCount}
              </span>
              <span
                key={countdownValue}
                className="font-display text-7xl sm:text-8xl font-extrabold text-white drop-shadow-[0_4px_20px_rgba(74,55,64,0.65)] tabular-nums animate-bounce"
              >
                {countdownValue}
              </span>
            </div>
          )}

          {/* Loading state */}
          {cameraState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#FFF6EC] p-6 text-center">
              <Camera className="w-10 h-10 text-[#F6CAD8] animate-pulse" />
              <p className="mt-3 text-sm font-semibold">Starting your camera studio...</p>
              <p className="mt-1 text-xs text-[#FCE7ED]/80">
                Please accept the browser permission prompt when asked.
              </p>
            </div>
          )}

          {/* Error state with Upload Studio fallback */}
          {cameraState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF6EC] text-[#4A3740] p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FCE7ED] flex items-center justify-center text-[#C84B78]">
                <VideoOff className="w-7 h-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{getErrorHeadline()}</h3>
              <p className="mt-1.5 text-sm text-[#68525D] max-w-md">{errorDetail}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-[#4A3740] text-sm font-semibold hover:bg-[#FCE7ED] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Camera</span>
                </button>
                <button
                  type="button"
                  onClick={onSwitchToUpload}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-xl bg-[#68525D] text-white text-sm font-semibold hover:bg-[#534049] transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Use Upload Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* Top overlay quick toggles when ready */}
          {cameraState === 'ready' && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto inline-flex items-center gap-1.5 bg-[#4A3740]/75 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-medium">
                <span>{facingMode === 'user' ? 'Front Cam' : 'Back Cam'}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {photos.length}/{targetCount} taken
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMirrorPreview((v) => !v)}
                  disabled={isCapturingSession}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer ${
                    mirrorPreview
                      ? 'bg-[#FCE7ED] text-[#4A3740]'
                      : 'bg-[#4A3740]/75 text-white'
                  }`}
                  title="Toggle mirror preview"
                >
                  <FlipHorizontal2 className="w-4 h-4" />
                  <span>Mirror {mirrorPreview ? 'ON' : 'OFF'}</span>
                </button>

                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={handleToggleCamera}
                    disabled={isCapturingSession}
                    className="min-h-[40px] min-w-[40px] px-3 py-1.5 rounded-xl bg-[#4A3740]/75 text-white text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-md hover:bg-[#4A3740] transition-colors cursor-pointer"
                    aria-label="Switch front or back camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                    <span className="hidden sm:inline">Flip</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Camera Controls Bar */}
        <div className="mt-4 rounded-3xl bg-white border border-[#D9B6C5]/70 p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Shot Count */}
            <div>
              <span className="block text-xs font-medium text-[#68525D] mb-1.5">
                Photos in Session
              </span>
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFF6EC] border border-[#D9B6C5]/50">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    disabled={isCapturingSession}
                    onClick={() => onTargetCountChange(count)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                      targetCount === count
                        ? 'bg-[#68525D] text-white'
                        : 'text-[#68525D] hover:text-[#4A3740]'
                    }`}
                  >
                    {count} Shots
                  </button>
                ))}
              </div>
            </div>

            {/* Countdown Timer */}
            <div>
              <span className="block text-xs font-medium text-[#68525D] mb-1.5">
                Countdown Timer
              </span>
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFF6EC] border border-[#D9B6C5]/50">
                {([3, 5, 10] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    disabled={isCapturingSession}
                    onClick={() => setCountdownSeconds(sec)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold tabular-nums inline-flex items-center gap-1 transition-colors cursor-pointer ${
                      countdownSeconds === sec
                        ? 'bg-[#FCE7ED] text-[#4A3740] border border-[#D9B6C5]'
                        : 'text-[#68525D] hover:text-[#4A3740]'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{sec}s</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Start Session / Reset */}
            <div className="flex items-center gap-2.5 ml-auto">
              {photos.length > 0 && !isCapturingSession && (
                <button
                  type="button"
                  onClick={() => onPhotosChange([])}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D9B6C5] bg-white text-[#4A3740] text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              )}

              <button
                type="button"
                disabled={cameraState !== 'ready' || isCapturingSession}
                onClick={handleStartSession}
                className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#68525D] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#534049] disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {isCapturingSession
                    ? retakingIndex !== null
                      ? `Retaking #${retakingIndex + 1}...`
                      : `Shooting ${currentShotIndex}/${targetCount}...`
                    : photos.length > 0
                      ? 'Retake All'
                      : 'Start Session'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Captured Strip Preview & Retake Slots */}
      <div className="lg:col-span-4 rounded-3xl bg-white border border-[#D9B6C5]/70 p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[#68525D]">Session Roll</p>
            <h3 className="text-lg font-bold text-[#4A3740]">Captured Shots</h3>
          </div>
          <span className="text-xs font-semibold tabular-nums text-[#68525D]">
            {photos.length} / {targetCount}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
          {Array.from({ length: targetCount }).map((_, idx) => {
            const shot = photos[idx];
            return (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden border border-[#D9B6C5]/60 bg-[#FFF6EC] aspect-[4/3] flex items-center justify-center"
              >
                {shot ? (
                  <>
                    <img
                      src={shot.dataUrl}
                      alt={`Captured frame ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/65 via-black/30 to-transparent flex items-center justify-between">
                      <span className="text-xs font-semibold text-white tabular-nums">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={isCapturingSession}
                        onClick={() => handleRetakeSingle(idx)}
                        className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white/95 text-[#4A3740] text-xs font-semibold inline-flex items-center gap-1 hover:bg-[#FCE7ED] transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retake</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <span className="text-xs font-semibold text-[#68525D]/80 tabular-nums">
                      Frame 0{idx + 1}
                    </span>
                    <p className="mt-0.5 text-[11px] text-[#68525D]/60">
                      Waiting for shot
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isSessionComplete && (
          <button
            type="button"
            onClick={onProceedToEditor}
            className="mt-5 w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#C84B78] text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#b03c67] transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Open Photo Editor</span>
          </button>
        )}

        {!isSessionComplete && photos.length > 0 && !isCapturingSession && (
          <button
            type="button"
            onClick={onProceedToEditor}
            className="mt-4 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FCE7ED] text-[#4A3740] text-sm font-semibold hover:bg-[#F6CAD8] transition-colors cursor-pointer"
          >
            Edit {photos.length} Photo{photos.length > 1 ? 's' : ''} Now
          </button>
        )}
      </div>
    </div>
  );
};
