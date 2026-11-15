import React, { useCallback, useEffect, useState } from 'react';
import { Camera, FolderHeart, Home, Sparkles } from 'lucide-react';
import { AboutPage } from './components/AboutPage';
import { HomePage } from './components/HomePage';
import { MyGallery } from './components/MyGallery';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PhotoEditor } from './components/PhotoEditor';
import { PhotoSession, SessionMode } from './components/PhotoSession';
import { StudioSelection } from './components/StudioSelection';
import { DEFAULT_ADJUSTMENTS, getFrameById, getStudioById } from './data/studios';
import {
  AppView,
  LayoutId,
  PhotoboothProjectState,
  SavedGalleryItem,
  StudioId,
} from './types/photobooth';
import { listGalleryCreations } from './utils/galleryDb';

function createInitialProject(
  studioId: StudioId = 'coquette-room',
  frameId?: string
): PhotoboothProjectState {
  const studio = getStudioById(studioId);
  const frame = frameId ? getFrameById(frameId) : studio.frames[0];
  return {
    studioId: studio.id,
    frameId: frame.id,
    layoutId: 'four-cut',
    filterId: studio.defaultFilter,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    photos: [],
    stickers: [],
    texts: [],
    showDateStamp: true,
    customDateText: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }),
    footerCaption: frame.defaultFooterText,
  };
}

function layoutForCount(count: number, current: LayoutId): LayoutId {
  if (count === 1) return 'single-polaroid';
  if (count === 2) return current === 'free-collage' ? 'free-collage' : 'double-cut';
  if (count === 3) return 'three-cut';
  if (
    current === 'grid-collage' ||
    current === 'film-strip' ||
    current === 'free-collage'
  ) {
    return current;
  }
  return 'four-cut';
}

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [sessionMode, setSessionMode] = useState<SessionMode>('camera');
  const [targetShotCount, setTargetShotCount] = useState<number>(4);
  const [project, setProject] = useState<PhotoboothProjectState>(() =>
    createInitialProject('coquette-room')
  );

  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);
  const [recentItems, setRecentItems] = useState<SavedGalleryItem[]>([]);

  const refreshRecentGallery = useCallback(async () => {
    try {
      const items = await listGalleryCreations('newest');
      setRecentItems(items);
    } catch {
      setRecentItems([]);
    }
  }, []);

  useEffect(() => {
    refreshRecentGallery();
  }, [refreshRecentGallery, galleryRefreshKey]);

  const navigateTo = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudioAndFrame = (studioId: StudioId, frameId: string) => {
    const studio = getStudioById(studioId);
    const frame = getFrameById(frameId);
    setProject((prev) => ({
      ...prev,
      studioId: studio.id,
      frameId: frame.id,
      filterId: prev.photos.length === 0 ? studio.defaultFilter : prev.filterId,
      footerCaption: frame.defaultFooterText,
    }));
  };

  const handleStartCapture = (
    mode: SessionMode,
    studioId?: StudioId,
    frameId?: string
  ) => {
    if (studioId) {
      handleSelectStudioAndFrame(studioId, frameId || getStudioById(studioId).frames[0].id);
    }
    setSessionMode(mode);
    navigateTo('session');
  };

  const handleProceedToEditor = () => {
    setProject((prev) => ({
      ...prev,
      layoutId: layoutForCount(prev.photos.length, prev.layoutId),
    }));
    navigateTo('editor');
  };

  const handleCreateAnother = () => {
    setProject((prev) => ({
      ...createInitialProject(prev.studioId, prev.frameId),
      photos: [],
    }));
    setSessionMode('camera');
    navigateTo('session');
  };

  const handleReopenFromGallery = (savedProject: PhotoboothProjectState) => {
    setProject(savedProject);
    navigateTo('editor');
  };

  const showMobileBottomNav = view !== 'session' && view !== 'editor';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF6EC] text-[#4A3740]">
      {/* Top Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 h-14 bg-[#FFF6EC]/90 backdrop-blur-md border-b border-[#D9B6C5]/50">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="font-display text-2xl font-extrabold tracking-tight text-[#4A3740] whitespace-nowrap shrink-0 cursor-pointer"
          >
            oipoto.
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#68525D]"
            aria-label="Primary navigation"
          >
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'studios', label: 'Studios' },
                { id: 'gallery', label: 'My Gallery' },
                { id: 'about', label: 'About' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer ${
                  view === item.id
                    ? 'text-[#4A3740] underline underline-offset-8 decoration-2 decoration-[#C84B78]'
                    : 'hover:text-[#4A3740]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => handleStartCapture('camera')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#68525D] text-white text-xs sm:text-sm font-bold hover:bg-[#534049] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Booth
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 ${showMobileBottomNav ? 'pb-20 md:pb-0' : ''}`}>
        {view === 'home' && (
          <HomePage
            recentItems={recentItems}
            onStartTakingPhotos={() => handleStartCapture('camera')}
            onExploreStudios={() => navigateTo('studios')}
            onStartUpload={() => handleStartCapture('upload')}
            onStartGroupMode={() => handleStartCapture('group')}
            onSelectStudioQuick={(studioId, frameId) => {
              handleSelectStudioAndFrame(studioId, frameId);
              navigateTo('studios');
            }}
            onOpenGallery={() => navigateTo('gallery')}
          />
        )}

        {view === 'studios' && (
          <StudioSelection
            selectedStudioId={project.studioId}
            selectedFrameId={project.frameId}
            onSelectStudioAndFrame={handleSelectStudioAndFrame}
            onStartCamera={(studioId, frameId) =>
              handleStartCapture('camera', studioId, frameId)
            }
            onStartUpload={(studioId, frameId) =>
              handleStartCapture('upload', studioId, frameId)
            }
            onStartGroup={(studioId, frameId) =>
              handleStartCapture('group', studioId, frameId)
            }
          />
        )}

        {view === 'session' && (
          <PhotoSession
            mode={sessionMode}
            onModeChange={setSessionMode}
            studioId={project.studioId}
            frameId={project.frameId}
            onSelectStudioAndFrame={handleSelectStudioAndFrame}
            photos={project.photos}
            targetCount={targetShotCount}
            onTargetCountChange={setTargetShotCount}
            onPhotosChange={(photos) =>
              setProject((prev) => ({ ...prev, photos }))
            }
            onProceedToEditor={handleProceedToEditor}
          />
        )}

        {view === 'editor' && (
          <PhotoEditor
            project={project}
            onChangeProject={setProject}
            onBackToCapture={() => navigateTo('session')}
            onCreateAnother={handleCreateAnother}
            onGalleryUpdated={() => setGalleryRefreshKey((k) => k + 1)}
          />
        )}

        {view === 'gallery' && (
          <MyGallery
            refreshKey={galleryRefreshKey}
            onReopenProject={handleReopenFromGallery}
            onStartNewSession={() => handleStartCapture('camera')}
          />
        )}

        {view === 'about' && (
          <AboutPage onStartBooth={() => handleStartCapture('camera')} />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#D9B6C5]/50 bg-white/60 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#68525D]">
          <div>
            <span className="font-display text-base font-extrabold text-[#4A3740]">
              oipoto.
            </span>
            <span className="ml-2">Your moments, your little photo studio.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('studios')}
              className="hover:text-[#4A3740] cursor-pointer"
            >
              Studios
            </button>
            <button
              type="button"
              onClick={() => navigateTo('gallery')}
              className="hover:text-[#4A3740] cursor-pointer"
            >
              My Gallery
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-[#4A3740] cursor-pointer"
            >
              Privacy & About
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar (under 15% height cap) */}
      {showMobileBottomNav && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF6EC]/95 backdrop-blur-md border-t border-[#D9B6C5]/70 pb-safe"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-4 h-14 items-center">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
                view === 'home' ? 'text-[#C84B78]' : 'text-[#68525D]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Home</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('studios')}
              className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
                view === 'studios' ? 'text-[#C84B78]' : 'text-[#68525D]'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Studios</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartCapture('camera')}
              className="flex flex-col items-center justify-center min-h-[44px] text-[#4A3740] cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Booth</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('gallery')}
              className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
                view === 'gallery' ? 'text-[#C84B78]' : 'text-[#68525D]'
              }`}
            >
              <FolderHeart className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Gallery</span>
            </button>
          </div>
        </nav>
      )}

      <OfflineIndicator />
    </div>
  );
}
