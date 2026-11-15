import {
  FilterId,
  LayoutDefinition,
  PhotoAdjustments,
  StickerDefinition,
  StudioDefinition,
} from '../types/photobooth';

export const DEFAULT_ADJUSTMENTS: PhotoAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  exposure: 0,
};

export const STUDIOS: StudioDefinition[] = [
  {
    id: 'k-studio',
    name: 'K-STUDIO',
    kicker: 'Minimal Seoul Four-Cut',
    description:
      'Clean Korean photobooth studio frames with crisp hairlines, monochrome elegance, and timeless editorial borders.',
    previewImage: '/src/assets/images/studio_kstudio_preview_1794735213687.jpg',
    accentBg: '#FFFFFF',
    accentBorder: '#D9B6C5',
    defaultFilter: 'bw',
    frames: [
      {
        id: 'k-mono-archive',
        studioId: 'k-studio',
        name: 'Seoul Mono Archive',
        subtitle: 'Crisp white strip with fine 1px hairlines',
        backgroundColor: '#FFFFFF',
        secondaryColor: '#F7F5F6',
        accentColor: '#4A3740',
        textColor: '#4A3740',
        pattern: 'k-minimal-white',
        defaultFooterText: 'OIPOTO SEOUL · 4-CUT ARCHIVE',
      },
      {
        id: 'k-noir-film',
        studioId: 'k-studio',
        name: 'Noir Booth Edition',
        subtitle: 'Matte charcoal frame with stark white keylines',
        backgroundColor: '#1E1A1C',
        secondaryColor: '#2E282B',
        accentColor: '#F6CAD8',
        textColor: '#FFF6EC',
        pattern: 'k-noir-matte',
        defaultFooterText: 'OIPOTO · NOIR EDITION',
      },
      {
        id: 'k-cloud-pastel',
        studioId: 'k-studio',
        name: 'Atelier Crop White',
        subtitle: 'Cream-white gallery mount with studio crop marks',
        backgroundColor: '#FFFDFB',
        secondaryColor: '#FCE7ED',
        accentColor: '#68525D',
        textColor: '#68525D',
        pattern: 'k-cream-crop',
        defaultFooterText: 'OIPOTO STUDIO · EDITION',
      },
    ],
  },
  {
    id: 'coquette-room',
    name: 'COQUETTE ROOM',
    kicker: 'Ribbons, Lace & Blush',
    description:
      'Dreamy baby blush backdrops adorned with delicate lace scallops, satin bows, rosebuds, and heart framing.',
    previewImage: '/src/assets/images/studio_coquette_preview_1794735213318.jpg',
    accentBg: '#FCE7ED',
    accentBorder: '#F6CAD8',
    defaultFilter: 'soft-pink',
    frames: [
      {
        id: 'coq-ribbon-lace',
        studioId: 'coquette-room',
        name: 'Satin Lace & Bows',
        subtitle: 'Baby blush lace border with corner satin ribbons',
        backgroundColor: '#FCE7ED',
        secondaryColor: '#FFF6EC',
        accentColor: '#D97B9C',
        textColor: '#68525D',
        pattern: 'coq-lace-blush',
        defaultFooterText: 'Sweet Moments · Oipoto',
      },
      {
        id: 'coq-heart-lock',
        studioId: 'coquette-room',
        name: 'Blush Heart Arch',
        subtitle: 'Soft pink mat with rounded arch framing & pearls',
        backgroundColor: '#F6CAD8',
        secondaryColor: '#FFFFFF',
        accentColor: '#B85077',
        textColor: '#5B3D4B',
        pattern: 'coq-heart-arch',
        defaultFooterText: 'Love Letter · Oipoto',
      },
      {
        id: 'coq-blush-check',
        studioId: 'coquette-room',
        name: 'Ballet Gingham',
        subtitle: 'Delicate pink gingham check with floral accents',
        backgroundColor: '#FFF5F8',
        secondaryColor: '#F6CAD8',
        accentColor: '#C86488',
        textColor: '#68525D',
        pattern: 'coq-gingham-bow',
        defaultFooterText: 'Coquette Club · Oipoto',
      },
    ],
  },
  {
    id: 'retro-corner',
    name: 'RETRO CORNER',
    kicker: '35mm Analog & Date Stamps',
    description:
      'Warm cream and sepia-toned vintage borders with analog film sprockets, subtle grain, and classic orange date stamps.',
    previewImage: '/src/assets/images/studio_retro_preview_1794735214274.jpg',
    accentBg: '#FFF6EC',
    accentBorder: '#D9B6C5',
    defaultFilter: 'retro-film',
    frames: [
      {
        id: 'ret-35mm-contact',
        studioId: 'retro-corner',
        name: '35mm Contact Roll',
        subtitle: 'Authentic perforated film strip with amber stamp',
        backgroundColor: '#251F1D',
        secondaryColor: '#3B312D',
        accentColor: '#F59E42',
        textColor: '#F7E7CE',
        pattern: 'ret-35mm-contact',
        defaultFooterText: 'KODAK 400 · OIPOTO ANALOG',
      },
      {
        id: 'ret-warm-polaroid',
        studioId: 'retro-corner',
        name: 'Cream Instant Stock',
        subtitle: 'Textured cream instant border with classic vignette',
        backgroundColor: '#FAF0E1',
        secondaryColor: '#EBD9C1',
        accentColor: '#C96A3B',
        textColor: '#5A463B',
        pattern: 'ret-warm-polaroid',
        defaultFooterText: 'ANALOG MEMORY · 90s ARCHIVE',
      },
      {
        id: 'ret-kodak-archive',
        studioId: 'retro-corner',
        name: 'Sepia Photo Mount',
        subtitle: 'Warm parchment border with double-rule framing',
        backgroundColor: '#F4E8D6',
        secondaryColor: '#DFC9AA',
        accentColor: '#A94F2E',
        textColor: '#4E3B31',
        pattern: 'ret-parchment-stamp',
        defaultFooterText: 'RETRO CORNER · OIPOTO',
      },
    ],
  },
  {
    id: 'scrapbook-lab',
    name: 'SCRAPBOOK LAB',
    kicker: 'Washi Tape & Torn Paper',
    description:
      'Playful collage spreads layered with torn paper edges, checkered washi tape, polaroid notes, and ink doodles.',
    previewImage: '/src/assets/images/studio_scrapbook_preview_1794735214822.jpg',
    accentBg: '#E7DDF3',
    accentBorder: '#D9B6C5',
    defaultFilter: 'creamy',
    frames: [
      {
        id: 'scr-washi-tape',
        studioId: 'scrapbook-lab',
        name: 'Lavender Washi Collage',
        subtitle: 'Soft lavender paper with taped photo corners',
        backgroundColor: '#E7DDF3',
        secondaryColor: '#FFF6EC',
        accentColor: '#C86488',
        textColor: '#4A3740',
        pattern: 'scr-washi-torn',
        defaultFooterText: 'My Little Scrapbook',
      },
      {
        id: 'scr-polaroid-pin',
        studioId: 'scrapbook-lab',
        name: 'Dot Grid Journal',
        subtitle: 'Cream dot-grid notebook with pastel tape strips',
        backgroundColor: '#FFF8F0',
        secondaryColor: '#FCE7ED',
        accentColor: '#7B66A6',
        textColor: '#58444E',
        pattern: 'scr-dot-notebook',
        defaultFooterText: 'Best Day Ever!',
      },
      {
        id: 'scr-checker-diary',
        studioId: 'scrapbook-lab',
        name: 'Torn Kraft Diary',
        subtitle: 'Warm kraft paper layers with doodle charms',
        backgroundColor: '#F3E3D0',
        secondaryColor: '#FFFFFF',
        accentColor: '#D45B7A',
        textColor: '#4E3A40',
        pattern: 'scr-kraft-diary',
        defaultFooterText: 'Dear Diary · Oipoto',
      },
    ],
  },
  {
    id: 'color-pop',
    name: 'COLOR POP',
    kicker: 'Bright Pastel & Starry',
    description:
      'Cheerful pastel gradients, confetti stars, bold playful typography, and candy-checkered photobooth frames.',
    accentBg: '#FCE7ED',
    accentBorder: '#C7B1E6',
    defaultFilter: 'bright',
    frames: [
      {
        id: 'pop-pastel-arcade',
        studioId: 'color-pop',
        name: 'Pastel Dream Gradient',
        subtitle: 'Pink to lavender blend with sparkling star bursts',
        backgroundColor: '#F6CAD8',
        secondaryColor: '#E7DDF3',
        accentColor: '#68525D',
        textColor: '#4A3740',
        pattern: 'pop-pastel-gradient',
        defaultFooterText: 'OIPOTO POP CLUB!',
      },
      {
        id: 'pop-confetti-grid',
        studioId: 'color-pop',
        name: 'Star Confetti Pop',
        subtitle: 'Crisp white border scattered with pastel shapes',
        backgroundColor: '#FFFFFF',
        secondaryColor: '#FCE7ED',
        accentColor: '#E06C94',
        textColor: '#4A3740',
        pattern: 'pop-confetti-white',
        defaultFooterText: 'LUCKY DAY · OIPOTO',
      },
      {
        id: 'pop-checker-y2k',
        studioId: 'color-pop',
        name: 'Lilac Checkerboard',
        subtitle: 'Playful pastel check frame with bold star badges',
        backgroundColor: '#E7DDF3',
        secondaryColor: '#FFFFFF',
        accentColor: '#845EC2',
        textColor: '#4A3740',
        pattern: 'pop-lilac-checker',
        defaultFooterText: 'SPARKLE SESSION',
      },
    ],
  },
];

export const PHOTO_LAYOUTS: LayoutDefinition[] = [
  {
    id: 'four-cut',
    name: 'Classic Four Cut',
    description: '4 vertical photos in classic strip',
    slotCount: 4,
    aspectRatio: 0.36, // e.g. 900 x 2500
  },
  {
    id: 'three-cut',
    name: 'Three Cut',
    description: '3 vertical frames with generous margin',
    slotCount: 3,
    aspectRatio: 0.44, // e.g. 900 x 2045
  },
  {
    id: 'double-cut',
    name: 'Double Cut',
    description: '2 stacked portrait frames',
    slotCount: 2,
    aspectRatio: 0.62, // e.g. 900 x 1450
  },
  {
    id: 'single-polaroid',
    name: 'Single Polaroid',
    description: '1 large framed hero print',
    slotCount: 1,
    aspectRatio: 0.82, // e.g. 900 x 1100
  },
  {
    id: 'grid-collage',
    name: 'Grid Collage',
    description: '4 photos in balanced 2x2 grid',
    slotCount: 4,
    aspectRatio: 0.8, // e.g. 1200 x 1500
  },
  {
    id: 'film-strip',
    name: 'Film Strip',
    description: '3 or 4 photos in sprocket film roll',
    slotCount: 4,
    aspectRatio: 0.38,
  },
  {
    id: 'free-collage',
    name: 'Free Collage',
    description: 'Playful tilted & layered scrapbook spread',
    slotCount: 4,
    aspectRatio: 0.82,
  },
];

export interface FilterDefinition {
  id: FilterId;
  name: string;
  swatchColor: string;
  cssPreview: string;
}

export const PHOTO_FILTERS: FilterDefinition[] = [
  {
    id: 'original',
    name: 'Original',
    swatchColor: '#FFFFFF',
    cssPreview: 'none',
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    swatchColor: '#F6CAD8',
    cssPreview: 'brightness(1.04) saturate(1.06) sepia(0.12) hue-rotate(-12deg)',
  },
  {
    id: 'creamy',
    name: 'Creamy',
    swatchColor: '#FFF6EC',
    cssPreview: 'brightness(1.06) contrast(0.94) saturate(0.95) sepia(0.14)',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    swatchColor: '#E5CFAF',
    cssPreview: 'contrast(1.05) sepia(0.32) saturate(0.88) brightness(0.98)',
  },
  {
    id: 'warm',
    name: 'Warm',
    swatchColor: '#F4C6A4',
    cssPreview: 'sepia(0.22) saturate(1.15) brightness(1.03)',
  },
  {
    id: 'cool',
    name: 'Cool',
    swatchColor: '#D6E4F5',
    cssPreview: 'contrast(1.04) saturate(0.92) hue-rotate(8deg) brightness(1.02)',
  },
  {
    id: 'bw',
    name: 'Black & White',
    swatchColor: '#4A3740',
    cssPreview: 'grayscale(1) contrast(1.14) brightness(1.03)',
  },
  {
    id: 'retro-film',
    name: 'Retro Film',
    swatchColor: '#D8B68A',
    cssPreview: 'contrast(1.1) sepia(0.26) saturate(0.9) brightness(0.96)',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    swatchColor: '#E7DDF3',
    cssPreview: 'brightness(1.08) contrast(0.92) saturate(1.08)',
  },
  {
    id: 'bright',
    name: 'Bright',
    swatchColor: '#FCE7ED',
    cssPreview: 'brightness(1.12) contrast(1.06) saturate(1.14)',
  },
];

export const STICKER_LIBRARY: StickerDefinition[] = [
  { id: 'heart-pink', label: 'Blush Heart', category: 'hearts', drawType: 'heart-pink' },
  { id: 'heart-outline', label: 'Line Heart', category: 'hearts', drawType: 'heart-outline' },
  { id: 'heart-double', label: 'Twin Hearts', category: 'hearts', drawType: 'heart-double' },
  { id: 'star-four', label: 'Sparkle Star', category: 'stars', drawType: 'star-four' },
  { id: 'star-chubby', label: 'Pastel Star', category: 'stars', drawType: 'star-chubby' },
  { id: 'star-cluster', label: 'Star Trio', category: 'stars', drawType: 'star-cluster' },
  { id: 'flower-daisy', label: 'Daisy', category: 'flowers', drawType: 'flower-daisy' },
  { id: 'flower-blossom', label: 'Blossom', category: 'flowers', drawType: 'flower-blossom' },
  { id: 'ribbon-pink', label: 'Pink Ribbon', category: 'ribbons', drawType: 'ribbon-pink' },
  { id: 'ribbon-lavender', label: 'Lilac Ribbon', category: 'ribbons', drawType: 'ribbon-lavender' },
  { id: 'bow-coquette', label: 'Satin Bow', category: 'bows', drawType: 'bow-coquette' },
  { id: 'bow-cream', label: 'Cream Bow', category: 'bows', drawType: 'bow-cream' },
  { id: 'cherry-pair', label: 'Cherries', category: 'cherries', drawType: 'cherry-pair' },
  { id: 'butterfly-pastel', label: 'Butterfly', category: 'butterflies', drawType: 'butterfly-pastel' },
  { id: 'doodle-swirl', label: 'Swirl Doodle', category: 'doodles', drawType: 'doodle-swirl' },
  { id: 'doodle-crown', label: 'Tiny Crown', category: 'doodles', drawType: 'doodle-crown' },
  { id: 'cute-cloud', label: 'Happy Cloud', category: 'cute', drawType: 'cute-cloud' },
  { id: 'cute-camera', label: 'Mini Cam', category: 'cute', drawType: 'cute-camera' },
  { id: 'cute-cat', label: 'Kitty Face', category: 'cute', drawType: 'cute-cat' },
  { id: 'cute-smile', label: 'Smiley', category: 'cute', drawType: 'cute-smile' },
];

export function getStudioById(studioId: string): StudioDefinition {
  return STUDIOS.find((s) => s.id === studioId) || STUDIOS[0];
}

export function getFrameById(frameId: string) {
  for (const studio of STUDIOS) {
    const found = studio.frames.find((f) => f.id === frameId);
    if (found) return found;
  }
  return STUDIOS[0].frames[0];
}

export function getLayoutById(layoutId: string): LayoutDefinition {
  return PHOTO_LAYOUTS.find((l) => l.id === layoutId) || PHOTO_LAYOUTS[0];
}
