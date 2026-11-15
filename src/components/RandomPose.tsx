import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { POSE_CATEGORIES, POSES } from '../data/poses';
import { PoseCategory, PoseItem } from '../types/photobooth';

const PoseIllustrationSvg: React.FC<{ type: PoseItem['illustration'] }> = ({ type }) => {
  return (
    <svg
      viewBox="0 0 140 120"
      className="w-28 h-24 shrink-0 rounded-2xl bg-[#FFF6EC] border border-[#D9B6C5]/60 p-2"
      aria-hidden="true"
    >
      {/* Cute background halo */}
      <circle cx="70" cy="62" r="42" fill="#FCE7ED" />
      {type === 'hand-heart' || type === 'group-pyramid' || type === 'back-to-back' || type === 'side-hug' || type === 'bunny-ears' ? (
        <>
          {/* Two figures */}
          <circle cx="50" cy="48" r="15" fill="#FFFFFF" stroke="#68525D" strokeWidth="2.5" />
          <circle cx="90" cy="48" r="15" fill="#FFFFFF" stroke="#68525D" strokeWidth="2.5" />
          <path d="M32 94 C32 74, 68 74, 68 94" fill="#F6CAD8" stroke="#68525D" strokeWidth="2.5" />
          <path d="M72 94 C72 74, 108 74, 108 94" fill="#E7DDF3" stroke="#68525D" strokeWidth="2.5" />
          {/* Faces */}
          <circle cx="46" cy="47" r="1.8" fill="#68525D" />
          <circle cx="54" cy="47" r="1.8" fill="#68525D" />
          <path d="M47 52 Q50 55 53 52" fill="none" stroke="#68525D" strokeWidth="2" strokeLinecap="round" />
          <circle cx="86" cy="47" r="1.8" fill="#68525D" />
          <circle cx="94" cy="47" r="1.8" fill="#68525D" />
          <path d="M87 52 Q90 55 93 52" fill="none" stroke="#68525D" strokeWidth="2" strokeLinecap="round" />
          {type === 'hand-heart' && (
            <path
              d="M70 76 C60 68, 60 58, 66 56 C69 55, 70 59, 70 60 C70 59, 71 55, 74 56 C80 58, 80 68, 70 76 Z"
              fill="#F28CB1"
              stroke="#68525D"
              strokeWidth="2"
            />
          )}
          {type === 'bunny-ears' && (
            <>
              <path d="M44 20 L48 34 M54 20 L52 34" stroke="#68525D" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M86 20 L90 34 M96 20 L94 34" stroke="#68525D" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </>
      ) : (
        <>
          {/* Single expressive figure */}
          <circle cx="70" cy="48" r="18" fill="#FFFFFF" stroke="#68525D" strokeWidth="2.8" />
          <path d="M46 98 C46 74, 94 74, 94 98" fill="#F6CAD8" stroke="#68525D" strokeWidth="2.8" />
          {/* Cheeks */}
          <circle cx="59" cy="51" r="3" fill="#F6CAD8" />
          <circle cx="81" cy="51" r="3" fill="#F6CAD8" />
          {/* Eyes */}
          {type === 'peace-wink' || type === 'funny-tongue' ? (
            <>
              <path d="M60 46 Q63 43 66 46" fill="none" stroke="#68525D" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="76" cy="46" r="2.2" fill="#68525D" />
            </>
          ) : (
            <>
              <circle cx="64" cy="46" r="2.2" fill="#68525D" />
              <circle cx="76" cy="46" r="2.2" fill="#68525D" />
            </>
          )}
          {/* Expression */}
          {type === 'surprised' ? (
            <circle cx="70" cy="55" r="4" fill="#F28CB1" stroke="#68525D" strokeWidth="2" />
          ) : (
            <path d="M65 54 Q70 59 75 54" fill="none" stroke="#68525D" strokeWidth="2.2" strokeLinecap="round" />
          )}
          {/* Hand cues */}
          {type === 'cheek-point' && (
            <path d="M44 62 L56 52" stroke="#68525D" strokeWidth="3" strokeLinecap="round" />
          )}
          {(type === 'peace-wink' || type === 'funny-tongue') && (
            <>
              <path d="M43 44 L47 54 M49 43 L49 54" stroke="#68525D" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M97 44 L93 54 M91 43 L91 54" stroke="#68525D" strokeWidth="2.4" strokeLinecap="round" />
            </>
          )}
          {type === 'flower-chin' && (
            <>
              <path d="M54 64 Q62 72 70 67" fill="none" stroke="#68525D" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M86 64 Q78 72 70 67" fill="none" stroke="#68525D" strokeWidth="2.8" strokeLinecap="round" />
            </>
          )}
        </>
      )}
    </svg>
  );
};

interface RandomPoseProps {
  defaultCategory?: PoseCategory | 'All';
  compact?: boolean;
}

export const RandomPose: React.FC<RandomPoseProps> = ({
  defaultCategory = 'All',
  compact = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PoseCategory | 'All'>(
    defaultCategory
  );

  const filteredPoses =
    selectedCategory === 'All'
      ? POSES
      : POSES.filter((p) => p.category === selectedCategory);

  const [currentPose, setCurrentPose] = useState<PoseItem>(
    () => filteredPoses[0] || POSES[0]
  );

  const handleCategoryChange = (cat: PoseCategory | 'All') => {
    setSelectedCategory(cat);
    const pool = cat === 'All' ? POSES : POSES.filter((p) => p.category === cat);
    if (pool.length > 0) {
      setCurrentPose(pool[0]);
    }
  };

  const handleRandomize = () => {
    const pool =
      selectedCategory === 'All'
        ? POSES
        : POSES.filter((p) => p.category === selectedCategory);
    if (pool.length <= 1) {
      setCurrentPose(pool[0] || POSES[0]);
      return;
    }
    const candidates = pool.filter((p) => p.id !== currentPose.id);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentPose(next);
  };

  return (
    <div
      className={`rounded-3xl bg-white border border-[#D9B6C5]/70 ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#68525D]">Pose Assistant</p>
          <h3 className="text-lg font-bold text-[#4A3740]">Random Pose Generator</h3>
        </div>
        <button
          type="button"
          onClick={handleRandomize}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#68525D] text-white text-sm font-semibold hover:bg-[#534049] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Shuffle className="w-4 h-4 shrink-0" />
          <span>Random Pose</span>
        </button>
      </div>

      {/* Category filter buttons */}
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Pose categories">
        <button
          type="button"
          onClick={() => handleCategoryChange('All')}
          className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[#FCE7ED] text-[#4A3740] border border-[#D9B6C5]'
              : 'bg-[#FFF6EC] text-[#68525D] hover:bg-[#FCE7ED]/60'
          }`}
        >
          All Poses
        </button>
        {POSE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FCE7ED] text-[#4A3740] border border-[#D9B6C5]'
                : 'bg-[#FFF6EC] text-[#68525D] hover:bg-[#FCE7ED]/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active pose display */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-[#D9B6C5]/40">
        <PoseIllustrationSvg type={currentPose.illustration} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-[#68525D]">
            <span className="font-semibold text-[#C84B78]">{currentPose.category}</span>
            <span aria-hidden="true">·</span>
            <span>Pose Prompt</span>
          </div>
          <h4 className="mt-1 text-base font-bold text-[#4A3740]">{currentPose.title}</h4>
          <p className="mt-1 text-sm text-[#68525D] leading-relaxed">
            {currentPose.instruction}
          </p>
          <p className="mt-1.5 text-xs text-[#68525D]/90">Tip: {currentPose.tip}</p>
        </div>
      </div>
    </div>
  );
};
