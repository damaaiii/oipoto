import React from 'react';
import { Camera, FolderHeart, Lock, Smartphone } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface AboutPageProps {
  onStartBooth: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartBooth }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="pb-6 border-b border-[#D9B6C5]/50">
        <p className="text-xs font-medium text-[#C84B78]">About OIPOTO</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#4A3740]">
          Your moments, your little photo studio.
        </h1>
        <p className="mt-3 text-base text-[#68525D] leading-relaxed">
          OIPOTO is a modern digital photobooth studio crafted for solo portraits, bestie hangouts, couples, and group memories. Everything runs directly inside your browser — from live camera countdowns and photo cropping to studio frames, filters, and high-resolution PNG/JPG exports.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-6">
          <div className="w-11 h-11 rounded-2xl bg-[#FCE7ED] flex items-center justify-center text-[#68525D]">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#4A3740]">
            Private by Design
          </h2>
          <p className="mt-1.5 text-sm text-[#68525D] leading-relaxed">
            Your camera stream only starts when you open the booth and grant browser permission, and stops automatically the moment you leave the camera page. Photos are processed locally with Canvas and never uploaded to external servers.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-6">
          <div className="w-11 h-11 rounded-2xl bg-[#E7DDF3] flex items-center justify-center text-[#68525D]">
            <FolderHeart className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#4A3740]">
            Local IndexedDB Gallery
          </h2>
          <p className="mt-1.5 text-sm text-[#68525D] leading-relaxed">
            Saved photo strips live in your browser’s local IndexedDB storage on this specific device. They are not synced across other devices, and you can delete individual strips or clear your entire gallery anytime.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-6">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF6EC] border border-[#D9B6C5] flex items-center justify-center text-[#68525D]">
            <Smartphone className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#4A3740]">
            Installable App (PWA)
          </h2>
          <p className="mt-1.5 text-sm text-[#68525D] leading-relaxed">
            Install OIPOTO onto your Android phone, iPhone home screen, or desktop for a clean standalone studio experience with cached offline shell assets.
          </p>
          <div className="mt-4">
            <PWAInstallButton variant="primary" />
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#D9B6C5]/70 p-6">
          <div className="w-11 h-11 rounded-2xl bg-[#FCE7ED] flex items-center justify-center text-[#68525D]">
            <Camera className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#4A3740]">
            Camera & Upload Flexibility
          </h2>
          <p className="mt-1.5 text-sm text-[#68525D] leading-relaxed">
            Use your front or rear camera with a 3s, 5s, or 10s countdown, or switch seamlessly to Upload Studio to turn existing JPG, PNG, and WebP photos into framed collages.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-[#FCE7ED]/70 border border-[#D9B6C5] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#4A3740]">
            Ready for your next 4-cut strip?
          </h3>
          <p className="mt-1 text-sm text-[#68525D]">
            Pick a studio and snap or upload your favorite moments.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartBooth}
          className="min-h-[48px] px-6 py-3 rounded-xl bg-[#68525D] text-white text-sm font-bold hover:bg-[#534049] transition-colors shrink-0 cursor-pointer"
        >
          Start Taking Photos
        </button>
      </div>
    </section>
  );
};
