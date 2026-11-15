export type AppView =
  | 'home'
  | 'studios'
  | 'session'
  | 'editor'
  | 'gallery'
  | 'about';

export type StudioId =
  | 'k-studio'
  | 'coquette-room'
  | 'retro-corner'
  | 'scrapbook-lab'
  | 'color-pop';

export type LayoutId =
  | 'four-cut'
  | 'three-cut'
  | 'double-cut'
  | 'single-polaroid'
  | 'grid-collage'
  | 'film-strip'
  | 'free-collage';

export type FilterId =
  | 'original'
  | 'vintage'
  | 'warm'
  | 'cool'
  | 'soft-pink'
  | 'creamy'
  | 'bw'
  | 'retro-film'
  | 'dreamy'
  | 'bright';

export interface PhotoAdjustments {
  brightness: number; // -50 to 50, default 0
  contrast: number;   // -50 to 50, default 0
  saturation: number; // -50 to 50, default 0
  warmth: number;     // -50 to 50, default 0
  exposure: number;   // -50 to 50, default 0
}

export interface PhotoTransform {
  zoom: number;    // 1 to 2.8
  offsetX: number; // -1 to 1 (normalized pan)
  offsetY: number; // -1 to 1 (normalized pan)
  rotation: number; // degrees
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  source: 'camera' | 'upload';
  transform: PhotoTransform;
}

export type StickerCategory =
  | 'hearts'
  | 'stars'
  | 'flowers'
  | 'ribbons'
  | 'bows'
  | 'cherries'
  | 'butterflies'
  | 'doodles'
  | 'cute';

export interface StickerDefinition {
  id: string;
  label: string;
  category: StickerCategory;
  drawType:
    | 'heart-pink'
    | 'heart-outline'
    | 'heart-double'
    | 'star-four'
    | 'star-chubby'
    | 'star-cluster'
    | 'flower-daisy'
    | 'flower-blossom'
    | 'ribbon-pink'
    | 'ribbon-lavender'
    | 'bow-coquette'
    | 'bow-cream'
    | 'cherry-pair'
    | 'butterfly-pastel'
    | 'doodle-swirl'
    | 'doodle-crown'
    | 'cute-cloud'
    | 'cute-camera'
    | 'cute-cat'
    | 'cute-smile';
}

export interface PlacedSticker {
  uid: string;
  stickerId: string;
  x: number;        // 0..1 normalized canvas width
  y: number;        // 0..1 normalized canvas height
  scale: number;    // 0.4..2.5
  rotation: number; // -180..180 deg
}

export type TextFontFamily = 'sans' | 'display' | 'handwriting' | 'mono';

export interface PlacedText {
  uid: string;
  text: string;
  x: number;        // 0..1
  y: number;        // 0..1
  fontSize: number; // relative base 18..64
  color: string;
  font: TextFontFamily;
  align: 'left' | 'center' | 'right';
}

export interface FrameDefinition {
  id: string;
  studioId: StudioId;
  name: string;
  subtitle: string;
  backgroundColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  pattern:
    | 'k-minimal-white'
    | 'k-noir-matte'
    | 'k-cream-crop'
    | 'coq-lace-blush'
    | 'coq-heart-arch'
    | 'coq-gingham-bow'
    | 'ret-35mm-contact'
    | 'ret-warm-polaroid'
    | 'ret-parchment-stamp'
    | 'scr-washi-torn'
    | 'scr-dot-notebook'
    | 'scr-kraft-diary'
    | 'pop-pastel-gradient'
    | 'pop-confetti-white'
    | 'pop-lilac-checker';
  defaultFooterText: string;
}

export interface StudioDefinition {
  id: StudioId;
  name: string;
  kicker: string;
  description: string;
  previewImage?: string;
  accentBg: string;
  accentBorder: string;
  defaultFilter: FilterId;
  frames: FrameDefinition[];
}

export interface LayoutDefinition {
  id: LayoutId;
  name: string;
  description: string;
  slotCount: number;
  aspectRatio: number; // width / height
}

export interface PhotoboothProjectState {
  studioId: StudioId;
  frameId: string;
  layoutId: LayoutId;
  filterId: FilterId;
  adjustments: PhotoAdjustments;
  photos: CapturedPhoto[];
  stickers: PlacedSticker[];
  texts: PlacedText[];
  showDateStamp: boolean;
  customDateText: string;
  footerCaption: string;
}

export interface SavedGalleryItem {
  id: string;
  createdAt: number;
  studioId: StudioId;
  studioName: string;
  frameName: string;
  layoutName: string;
  previewDataUrl: string;
  projectState: PhotoboothProjectState;
}

export type PoseCategory =
  | 'Solo Pose'
  | 'Bestie Pose'
  | 'Duo Pose'
  | 'Group Pose'
  | 'Funny Pose'
  | 'Cute Pose';

export interface PoseItem {
  id: string;
  category: PoseCategory;
  title: string;
  instruction: string;
  tip: string;
  illustration:
    | 'cheek-point'
    | 'hand-heart'
    | 'peace-wink'
    | 'surprised'
    | 'head-tilt'
    | 'flower-chin'
    | 'back-to-back'
    | 'group-pyramid'
    | 'cool-shades'
    | 'bunny-ears'
    | 'side-hug'
    | 'funny-tongue';
}
