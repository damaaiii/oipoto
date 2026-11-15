import React from 'react';
import {
  ArrowRight,
  Camera,
  Download,
  Frame,
  ImagePlus,
  Sliders,
  Smile,
  Sparkles,
  Users,
} from 'lucide-react';
import { STUDIOS } from '../data/studios';
import { SavedGalleryItem, StudioId } from '../types/photobooth';
import { PWAInstallButton } from './PWAInstallButton';
import { RandomPose } from './RandomPose';

interface HomePageProps {
  recentItems: SavedGalleryItem[];
  onStartTakingPhotos: () => void;
  onExploreStudios: () => void;
  onStartUpload: () => void;
  onStartGroupMode: () => void;
  onSelectStudioQuick: (studioId: StudioId, frameId: string) => void;
  onOpenGallery: () => void;
}

const HOW_IT_WORKS_STEPS = [
  { num: '01', title: 'Choose Studio', desc: 'Pick K-Studio, Coquette, Retro, Scrapbook, or Color Pop.', icon: Sparkles },
  { num: '02', title: 'Camera or Upload', desc: 'Snap live photos or import JPG/PNG shots locally.', icon: Camera },
  { num: '03', title: 'Set Shot Count', desc: 'Pick 2, 3, or 4 shots and a 3s, 5s, or 10s timer.', icon: Users },
  { num: '04', title: 'Snap & Retake', desc: 'Follow pose prompts and retake any shot you like.', icon: ImagePlus },
  { num: '05', title: 'Frame & Filter', desc: 'Switch layouts, film filters, and light tones.', icon: Frame },
  { num: '06', title: 'Stickers & Notes', desc: 'Drag ribbons, stars, custom dates, and captions.', icon: Smile },
  { num: '07', title: 'Download Strip', desc: 'Export crisp PNG/JPG or save to My Gallery.', icon: Download },
];

export const HomePage: React.FC<HomePageProps> = ({
  recentItems,
  onStartTakingPhotos,
  onExploreStudios,
  onStartUpload,
  onStartGroupMode,
  onSelectStudioQuick,
  onOpenGallery,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2">
            <p className="text-xs font-semibold tracking-wide text-[#C84B78]">
              Digital Photobooth Studio · Solo & Group Ready
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#4A3740] leading-[1.08] text-balance">
              oipoto. Your moments, your little photo studio.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#68525D] leading-relaxed max-w-xl">
              Snap four-cut strips with your camera or remix gallery photos with Korean studio borders, coquette ribbons, retro 35mm grain, stickers, and handwritten notes.
            </p>

            {/* Primary CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartTakingPhotos}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[#68525D] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#534049] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Start Taking Photos</span>
              </button>

              <button
                type="button"
                onClick={onExploreStudios}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-[#FCE7ED] text-[#4A3740] text-sm font-bold inline-flex items-center gap-2 hover:bg-[#F6CAD8] transition-colors cursor-pointer"
              >
                <span>Explore Studios</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <PWAInstallButton variant="subtle" />
            </div>

            {/* Quick mode links (unboxed typographic actions) */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#68525D]">
              <button
                type="button"
                onClick={onStartUpload}
                className="inline-flex items-center gap-1.5 hover:text-[#4A3740] underline underline-offset-4 decoration-[#D9B6C5] cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Upload from Gallery</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onStartGroupMode}
                className="inline-flex items-center gap-1.5 hover:text-[#4A3740] underline underline-offset-4 decoration-[#D9B6C5] cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Group Mode</span>
              </button>
              <span aria-hidden="true">·</span>
              <span>100% Private Local Processing</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[290px] sm:min-h-[380px] rounded-3xl overflow-hidden border border-[#D9B6C5]/80 bg-[#FCE7ED]">
              <img
                src="/src/assets/images/hero_photobooth_studio_1794735212825.jpg"
                alt="OIPOTO photobooth strips, pastel ribbons, and compact studio camera flatlay"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-[#4A3740]/75 via-[#4A3740]/30 to-transparent text-white flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#FCE7ED]">Instant Strip Studio</p>
                  <p className="text-sm sm:text-base font-bold">
                    5 Aesthetic Studios · 7 Photo Layouts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartTakingPhotos}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-white text-[#4A3740] text-xs font-bold hover:bg-[#FCE7ED] transition-colors shrink-0 cursor-pointer"
                >
                  Open Booth
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Studios */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-[#68525D]">Curated Visual Themes</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3740]">
              Popular Studios
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreStudios}
            className="text-sm font-bold text-[#C84B78] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>See all 5 studios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STUDIOS.map((studio) => (
            <button
              key={studio.id}
              type="button"
              onClick={() => onSelectStudioQuick(studio.id, studio.frames[0].id)}
              className="group text-left rounded-3xl bg-white border border-[#D9B6C5]/70 p-3 hover:border-[#68525D] transition-all cursor-pointer"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FCE7ED]">
                {studio.previewImage ? (
                  <img
                    src={studio.previewImage}
                    alt={studio.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#F6CAD8] via-[#FCE7ED] to-[#E7DDF3] flex flex-col items-center justify-center p-3 text-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-7 rounded bg-white border border-[#68525D]/30 -rotate-6" />
                      <span className="w-5 h-7 rounded bg-[#FFF6EC] border border-[#68525D]/30 rotate-6" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-[#4A3740]">Color Pop</span>
                  </div>
                )}
              </div>
              <div className="mt-3 px-1">
                <p className="text-[11px] font-medium text-[#68525D]">{studio.kicker}</p>
                <h3 className="mt-0.5 text-base font-bold text-[#4A3740]">{studio.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Frames & Pose Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-[#68525D]">15 Distinct Borders</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3740]">
                Featured Frames
              </h2>
              <p className="mt-1.5 text-sm text-[#68525D]">
                Every frame pairs custom textures, bows, film sprockets, or torn washi paper with matching photo layouts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                STUDIOS[0].frames[0],
                STUDIOS[1].frames[0],
                STUDIOS[2].frames[0],
                STUDIOS[3].frames[0],
              ].map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => onSelectStudioQuick(frame.studioId, frame.id)}
                  className="flex items-center gap-3.5 text-left rounded-2xl bg-white border border-[#D9B6C5]/70 p-3.5 hover:border-[#68525D] transition-colors cursor-pointer"
                >
                  <div
                    className="w-12 h-14 rounded-lg border border-[#D9B6C5]/60 shrink-0 flex flex-col justify-between p-1.5"
                    style={{ backgroundColor: frame.backgroundColor }}
                  >
                    <span
                      className="h-2.5 w-full rounded-xs"
                      style={{ backgroundColor: frame.secondaryColor }}
                    />
                    <span
                      className="h-2.5 w-full rounded-xs"
                      style={{ backgroundColor: frame.secondaryColor }}
                    />
                    <span
                      className="h-2.5 w-full rounded-xs"
                      style={{ backgroundColor: frame.secondaryColor }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#C84B78] uppercase">
                      {frame.studioId.replace('-', ' ')}
                    </p>
                    <h3 className="text-sm font-bold text-[#4A3740] truncate">
                      {frame.name}
                    </h3>
                    <p className="text-xs text-[#68525D] line-clamp-1">{frame.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <RandomPose />
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#D9B6C5]/40">
            <div>
              <p className="text-xs font-medium text-[#68525D]">Quick Guide</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#4A3740]">
                How It Works
              </h2>
            </div>
            <button
              type="button"
              onClick={onStartTakingPhotos}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#68525D] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#534049] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Try the Booth Now</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            {HOW_IT_WORKS_STEPS.map(({ num, title, desc, icon: Icon }) => (
              <div key={num} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FCE7ED] flex items-center justify-center text-[#68525D] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-stamp font-medium text-[#C84B78]">
                    {num}
                  </span>
                  <h3 className="text-sm font-bold text-[#4A3740]">{title}</h3>
                  <p className="mt-0.5 text-xs text-[#68525D] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recently Created (only when local IndexedDB items exist) */}
      {recentItems.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-medium text-[#68525D]">Saved Locally on This Device</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#4A3740]">
                Recently Created
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenGallery}
              className="text-sm font-bold text-[#C84B78] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Open My Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={onOpenGallery}
                className="text-left rounded-2xl bg-white border border-[#D9B6C5]/70 p-3 hover:border-[#68525D] transition-colors cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-xl bg-[#FFF6EC] p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.previewDataUrl}
                    alt={item.frameName}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                <p className="mt-2 text-xs font-bold text-[#4A3740] truncate">
                  {item.frameName}
                </p>
                <p className="text-[11px] text-[#68525D] truncate">{item.studioName}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
