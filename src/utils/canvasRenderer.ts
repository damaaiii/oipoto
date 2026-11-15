import {
  getFrameById,
  getLayoutById,
} from '../data/studios';
import {
  CapturedPhoto,
  FilterId,
  FrameDefinition,
  LayoutId,
  PhotoAdjustments,
  PhotoboothProjectState,
} from '../types/photobooth';
import { STICKER_LIBRARY } from '../data/studios';
import { drawStickerOnCanvas } from './stickerArtwork';

export interface SlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number; // degrees, used for free-collage
}

export function getCanvasDimensions(layoutId: LayoutId): { width: number; height: number } {
  switch (layoutId) {
    case 'four-cut':
      return { width: 900, height: 2500 };
    case 'three-cut':
      return { width: 900, height: 2040 };
    case 'double-cut':
      return { width: 900, height: 1450 };
    case 'single-polaroid':
      return { width: 1000, height: 1220 };
    case 'grid-collage':
      return { width: 1200, height: 1500 };
    case 'film-strip':
      return { width: 920, height: 2420 };
    case 'free-collage':
      return { width: 1200, height: 1460 };
  }
}

export function computeLayoutSlots(
  layoutId: LayoutId,
  width: number,
  height: number
): SlotRect[] {
  switch (layoutId) {
    case 'four-cut': {
      const padX = 76;
      const topPad = 128;
      const bottomPad = 240;
      const gap = 36;
      const slotW = width - padX * 2;
      const slotH = (height - topPad - bottomPad - gap * 3) / 4;
      return [0, 1, 2, 3].map((i) => ({
        x: padX,
        y: topPad + i * (slotH + gap),
        w: slotW,
        h: slotH,
      }));
    }
    case 'three-cut': {
      const padX = 80;
      const topPad = 124;
      const bottomPad = 240;
      const gap = 38;
      const slotW = width - padX * 2;
      const slotH = (height - topPad - bottomPad - gap * 2) / 3;
      return [0, 1, 2].map((i) => ({
        x: padX,
        y: topPad + i * (slotH + gap),
        w: slotW,
        h: slotH,
      }));
    }
    case 'double-cut': {
      const padX = 84;
      const topPad = 120;
      const bottomPad = 220;
      const gap = 44;
      const slotW = width - padX * 2;
      const slotH = (height - topPad - bottomPad - gap) / 2;
      return [0, 1].map((i) => ({
        x: padX,
        y: topPad + i * (slotH + gap),
        w: slotW,
        h: slotH,
      }));
    }
    case 'single-polaroid': {
      const padX = 86;
      const topPad = 92;
      const bottomPad = 260;
      return [
        {
          x: padX,
          y: topPad,
          w: width - padX * 2,
          h: height - topPad - bottomPad,
        },
      ];
    }
    case 'grid-collage': {
      const padX = 74;
      const topPad = 120;
      const bottomPad = 210;
      const gap = 36;
      const slotW = (width - padX * 2 - gap) / 2;
      const slotH = (height - topPad - bottomPad - gap) / 2;
      return [
        { x: padX, y: topPad, w: slotW, h: slotH },
        { x: padX + slotW + gap, y: topPad, w: slotW, h: slotH },
        { x: padX, y: topPad + slotH + gap, w: slotW, h: slotH },
        { x: padX + slotW + gap, y: topPad + slotH + gap, w: slotW, h: slotH },
      ];
    }
    case 'film-strip': {
      const padX = 128;
      const topPad = 132;
      const bottomPad = 230;
      const gap = 42;
      const slotW = width - padX * 2;
      const slotH = (height - topPad - bottomPad - gap * 3) / 4;
      return [0, 1, 2, 3].map((i) => ({
        x: padX,
        y: topPad + i * (slotH + gap),
        w: slotW,
        h: slotH,
      }));
    }
    case 'free-collage': {
      return [
        { x: 95, y: 120, w: 485, h: 520, rotation: -3.2 },
        { x: 615, y: 150, w: 485, h: 510, rotation: 2.8 },
        { x: 115, y: 695, w: 495, h: 510, rotation: 2.2 },
        { x: 610, y: 675, w: 485, h: 525, rotation: -2.6 },
      ];
    }
  }
}

const imageCache = new Map<string, HTMLImageElement>();

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  const existing = imageCache.get(src);
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve(existing);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function clampByte(val: number): number {
  return val < 0 ? 0 : val > 255 ? 255 : val;
}

function applyPixelFilterAndAdjustments(
  canvas: HTMLCanvasElement,
  filterId: FilterId,
  adj: PhotoAdjustments
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const d = imgData.data;

  // Base multipliers from adjustments (-50..50)
  const expGain = Math.pow(2, adj.exposure / 55);
  const brightOffset = adj.brightness * 1.45;
  const contrastFactor = Math.pow((100 + adj.contrast * 1.1) / 100, 2);
  const satFactor = 1 + adj.saturation / 55;
  const warmthOffset = adj.warmth * 0.7;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    // 1. Apply preset filter
    switch (filterId) {
      case 'vintage': {
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = r * 0.65 + sr * 0.35;
        g = g * 0.65 + sg * 0.35;
        b = b * 0.68 + sb * 0.32;
        r = (r - 128) * 1.06 + 128;
        g = (g - 128) * 1.04 + 128;
        b = (b - 128) * 0.98 + 128;
        break;
      }
      case 'warm': {
        r = r * 1.07 + 8;
        g = g * 1.02 + 2;
        b = b * 0.91;
        break;
      }
      case 'cool': {
        r = r * 0.93;
        g = g * 1.01 + 2;
        b = b * 1.09 + 8;
        break;
      }
      case 'soft-pink': {
        r = r * 1.06 + 10;
        g = g * 0.99 + 4;
        b = b * 1.02 + 8;
        break;
      }
      case 'creamy': {
        r = r * 1.03 + 12;
        g = g * 1.02 + 10;
        b = b * 0.96 + 6;
        r = (r - 128) * 0.92 + 128;
        g = (g - 128) * 0.92 + 128;
        b = (b - 128) * 0.92 + 128;
        break;
      }
      case 'bw': {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const cLum = (lum - 128) * 1.14 + 128 + 4;
        r = cLum;
        g = cLum;
        b = cLum;
        break;
      }
      case 'retro-film': {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        r = r * 0.86 + lum * 0.14 + 10;
        g = g * 0.86 + lum * 0.14 + 4;
        b = b * 0.8 + lum * 0.2 - 6;
        r = (r - 128) * 1.1 + 128;
        g = (g - 128) * 1.08 + 128;
        b = (b - 128) * 1.04 + 128;
        break;
      }
      case 'dreamy': {
        r = r * 1.04 + 14;
        g = g * 1.02 + 12;
        b = b * 1.06 + 15;
        r = (r - 128) * 0.9 + 128;
        g = (g - 128) * 0.9 + 128;
        b = (b - 128) * 0.9 + 128;
        break;
      }
      case 'bright': {
        r = r * 1.09 + 10;
        g = g * 1.09 + 10;
        b = b * 1.08 + 9;
        break;
      }
      case 'original':
      default:
        break;
    }

    // 2. Exposure & Brightness
    r = r * expGain + brightOffset;
    g = g * expGain + brightOffset;
    b = b * expGain + brightOffset;

    // 3. Contrast
    if (adj.contrast !== 0) {
      r = (r - 128) * contrastFactor + 128;
      g = (g - 128) * contrastFactor + 128;
      b = (b - 128) * contrastFactor + 128;
    }

    // 4. Saturation
    if (adj.saturation !== 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * satFactor;
      g = gray + (g - gray) * satFactor;
      b = gray + (b - gray) * satFactor;
    }

    // 5. Warmth
    if (adj.warmth !== 0) {
      r += warmthOffset;
      b -= warmthOffset * 0.85;
    }

    d[i] = clampByte(r);
    d[i + 1] = clampByte(g);
    d[i + 2] = clampByte(b);
  }

  ctx.putImageData(imgData, 0, 0);
}

function drawFrameBackground(
  ctx: CanvasRenderingContext2D,
  frame: FrameDefinition,
  layoutId: LayoutId,
  w: number,
  h: number
) {
  ctx.save();

  // Base fill
  if (frame.pattern === 'pop-pastel-gradient') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#F6CAD8');
    grad.addColorStop(0.5, '#FCE7ED');
    grad.addColorStop(1, '#E7DDF3');
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = frame.backgroundColor;
  }
  ctx.fillRect(0, 0, w, h);

  // Distinct Studio Patterns
  switch (frame.pattern) {
    case 'k-minimal-white': {
      ctx.strokeStyle = 'rgba(74, 55, 64, 0.16)';
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 24, w - 48, h - 48);
      break;
    }
    case 'k-noir-matte': {
      ctx.strokeStyle = 'rgba(255, 246, 236, 0.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(26, 26, w - 52, h - 52);
      break;
    }
    case 'k-cream-crop': {
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 3;
      const m = 30;
      const len = 34;
      // 4 corner crop marks
      ctx.beginPath();
      ctx.moveTo(m, m + len); ctx.lineTo(m, m); ctx.lineTo(m + len, m);
      ctx.moveTo(w - m - len, m); ctx.lineTo(w - m, m); ctx.lineTo(w - m, m + len);
      ctx.moveTo(m, h - m - len); ctx.lineTo(m, h - m); ctx.lineTo(m + len, h - m);
      ctx.moveTo(w - m - len, h - m); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m, h - m - len);
      ctx.stroke();
      break;
    }
    case 'coq-lace-blush': {
      // Scalloped lace border along all edges
      ctx.fillStyle = '#FFFFFF';
      const r = 22;
      for (let x = r; x < w; x += r * 1.7) {
        ctx.beginPath();
        ctx.arc(x, 0, r, 0, Math.PI);
        ctx.arc(x, h, r, Math.PI, Math.PI * 2);
        ctx.fill();
      }
      for (let y = r; y < h; y += r * 1.7) {
        ctx.beginPath();
        ctx.arc(0, y, r, -Math.PI / 2, Math.PI / 2);
        ctx.arc(w, y, r, Math.PI / 2, (Math.PI * 3) / 2);
        ctx.fill();
      }
      // Subtle lace eyelets
      ctx.fillStyle = '#FCE7ED';
      for (let x = r; x < w; x += r * 1.7) {
        ctx.beginPath();
        ctx.arc(x, 12, 4, 0, Math.PI * 2);
        ctx.arc(x, h - 12, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'coq-heart-arch': {
      // Soft inner pearl frame
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 5;
      ctx.setLineDash([2, 16]);
      ctx.lineCap = 'round';
      ctx.strokeRect(32, 32, w - 64, h - 64);
      ctx.setLineDash([]);
      break;
    }
    case 'coq-gingham-bow': {
      ctx.fillStyle = 'rgba(246, 202, 216, 0.36)';
      const step = 44;
      for (let x = 0; x < w; x += step * 2) {
        ctx.fillRect(x, 0, step, h);
      }
      for (let y = 0; y < h; y += step * 2) {
        ctx.fillRect(0, y, w, step);
      }
      break;
    }
    case 'ret-35mm-contact': {
      // Film edge tracks
      ctx.fillStyle = '#181311';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#FFF6EC';
      const holeW = 34;
      const holeH = 50;
      for (let y = 44; y < h - 44; y += 88) {
        ctx.beginPath();
        ctx.roundRect(28, y, holeW, holeH, 8);
        ctx.roundRect(w - 28 - holeW, y, holeW, holeH, 8);
        ctx.fill();
      }
      break;
    }
    case 'ret-warm-polaroid': {
      // Subtle paper fiber speckles
      ctx.fillStyle = 'rgba(130, 95, 65, 0.06)';
      for (let i = 0; i < 450; i++) {
        const px = ((i * 197) % w);
        const py = ((i * 313) % h);
        ctx.fillRect(px, py, 3, 3);
      }
      ctx.strokeStyle = 'rgba(90, 70, 59, 0.16)';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      break;
    }
    case 'ret-parchment-stamp': {
      ctx.strokeStyle = frame.accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, w - 56, h - 56);
      ctx.strokeStyle = 'rgba(169, 79, 46, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, w - 80, h - 80);
      break;
    }
    case 'scr-washi-torn': {
      // Layered torn cream sheet in center
      ctx.fillStyle = '#FFF6EC';
      ctx.beginPath();
      ctx.moveTo(28, 42);
      for (let x = 28; x <= w - 28; x += 32) {
        ctx.lineTo(x, 38 + Math.sin(x * 0.2) * 6);
      }
      for (let y = 42; y <= h - 42; y += 44) {
        ctx.lineTo(w - 28 + Math.cos(y * 0.2) * 5, y);
      }
      for (let x = w - 28; x >= 28; x -= 32) {
        ctx.lineTo(x, h - 40 + Math.sin(x * 0.25) * 6);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'scr-dot-notebook': {
      ctx.fillStyle = 'rgba(123, 102, 166, 0.22)';
      for (let x = 40; x < w - 20; x += 36) {
        for (let y = 40; y < h - 20; y += 36) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'scr-kraft-diary': {
      // Torn pink paper strip at top & bottom
      ctx.fillStyle = '#FCE7ED';
      ctx.fillRect(0, 0, w, 92);
      ctx.fillRect(0, h - 185, w, 185);
      ctx.strokeStyle = '#D9B6C5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 92);
      for (let x = 0; x <= w; x += 28) {
        ctx.lineTo(x, 92 + (x % 56 === 0 ? 7 : -4));
      }
      ctx.stroke();
      break;
    }
    case 'pop-confetti-white': {
      const colors = ['#F6CAD8', '#E7DDF3', '#FFE49E', '#B8E0D2'];
      for (let i = 0; i < 42; i++) {
        const cx = ((i * 239 + 40) % (w - 40)) + 20;
        const cy = ((i * 419 + 50) % (h - 40)) + 20;
        ctx.fillStyle = colors[i % colors.length];
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * 0.7) % Math.PI);
        if (i % 2 === 0) {
          ctx.fillRect(-10, -5, 20, 10);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      break;
    }
    case 'pop-lilac-checker': {
      const cell = 52;
      ctx.fillStyle = '#FCE7ED';
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          if (((x / cell + y / cell) | 0) % 2 === 0) {
            ctx.fillRect(x, y, cell, cell);
          }
        }
      }
      // Crisp inner panel
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(42, 42, w - 84, h - 84, 34);
      ctx.fill();
      break;
    }
    default:
      break;
  }

  // If layout is film-strip regardless of frame, add film sprockets overlay on side rails
  if (layoutId === 'film-strip' && frame.pattern !== 'ret-35mm-contact') {
    ctx.fillStyle = frame.textColor;
    ctx.globalAlpha = 0.18;
    for (let y = 52; y < h - 52; y += 84) {
      ctx.beginPath();
      ctx.roundRect(30, y, 36, 48, 8);
      ctx.roundRect(w - 66, y, 36, 48, 8);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawFrameDecorationsOverSlots(
  ctx: CanvasRenderingContext2D,
  frame: FrameDefinition,
  slots: SlotRect[],
  w: number,
  h: number
) {
  ctx.save();

  // Studio header stamp
  ctx.fillStyle = frame.textColor;
  ctx.font = '700 26px "Bricolage Grotesque", "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (frame.studioId === 'k-studio') {
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OIPOTO · SEOUL STUDIO', w / 2, 66);
  } else if (frame.studioId === 'coquette-room') {
    // Draw cute corner bows at top
    ctx.save();
    ctx.translate(92, 68);
    drawStickerOnCanvas(ctx, 'bow-coquette', 68);
    ctx.restore();
    ctx.save();
    ctx.translate(w - 92, 68);
    drawStickerOnCanvas(ctx, 'bow-coquette', 68);
    ctx.restore();
  } else if (frame.studioId === 'scrapbook-lab') {
    // Washi tape strips on photo corners
    slots.forEach((slot, idx) => {
      ctx.save();
      const tapeX = idx % 2 === 0 ? slot.x + 28 : slot.x + slot.w - 28;
      const tapeY = slot.y + 4;
      ctx.translate(tapeX, tapeY);
      ctx.rotate(idx % 2 === 0 ? -0.35 : 0.35);
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(246, 202, 216, 0.85)' : 'rgba(231, 221, 243, 0.9)';
      ctx.fillRect(-54, -15, 108, 30);
      ctx.strokeStyle = 'rgba(104, 82, 93, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-54, -15, 108, 30);
      ctx.restore();
    });
  } else if (frame.studioId === 'color-pop') {
    ctx.save();
    ctx.translate(95, 64);
    drawStickerOnCanvas(ctx, 'star-four', 56);
    ctx.restore();
    ctx.save();
    ctx.translate(w - 95, 64);
    drawStickerOnCanvas(ctx, 'star-chubby', 56);
    ctx.restore();
  } else if (frame.studioId === 'retro-corner') {
    ctx.fillStyle = frame.accentColor;
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ISO 400 · 35MM', 84, 68);
    ctx.textAlign = 'right';
    ctx.fillText('EXP 36', w - 84, 68);
  }

  // K-Studio frame index numbers beside slots
  if (frame.studioId === 'k-studio') {
    ctx.fillStyle = frame.textColor;
    ctx.globalAlpha = 0.5;
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    slots.forEach((s, i) => {
      ctx.fillText(`0${i + 1}`, s.x - 14, s.y + 22);
    });
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

async function drawSinglePhotoSlot(
  ctx: CanvasRenderingContext2D,
  photo: CapturedPhoto | undefined,
  slot: SlotRect,
  frame: FrameDefinition,
  filterId: FilterId,
  adjustments: PhotoAdjustments
) {
  ctx.save();

  const cx = slot.x + slot.w / 2;
  const cy = slot.y + slot.h / 2;
  ctx.translate(cx, cy);
  if (slot.rotation) {
    ctx.rotate((slot.rotation * Math.PI) / 180);
  }

  const rx = -slot.w / 2;
  const ry = -slot.h / 2;

  // Polaroid / free-collage backing card
  if (slot.rotation || frame.pattern === 'ret-warm-polaroid') {
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(74, 55, 64, 0.14)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.roundRect(rx - 14, ry - 14, slot.w + 28, slot.h + 28, 12);
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  const cornerRadius =
    frame.pattern === 'coq-heart-arch'
      ? 36
      : frame.studioId === 'color-pop'
        ? 22
        : frame.studioId === 'k-studio'
          ? 4
          : 12;

  // Clip photo region
  ctx.beginPath();
  ctx.roundRect(rx, ry, slot.w, slot.h, cornerRadius);
  ctx.clip();

  if (!photo) {
    ctx.fillStyle = frame.secondaryColor;
    ctx.fillRect(rx, ry, slot.w, slot.h);
    ctx.restore();
    return;
  }

  try {
    const img = await loadImageElement(photo.dataUrl);

    // Render photo to offscreen canvas at slot resolution for accurate pixel filtering
    const off = document.createElement('canvas');
    const targetW = Math.max(200, Math.round(slot.w));
    const targetH = Math.max(200, Math.round(slot.h));
    off.width = targetW;
    off.height = targetH;
    const octx = off.getContext('2d');
    if (octx) {
      octx.save();
      octx.translate(targetW / 2, targetH / 2);

      const { zoom = 1, offsetX = 0, offsetY = 0, rotation = 0 } = photo.transform || {};
      if (rotation) {
        octx.rotate((rotation * Math.PI) / 180);
      }

      // Compute cover dimensions
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const slotAspect = targetW / targetH;
      let drawW = targetW;
      let drawH = targetH;

      if (imgAspect > slotAspect) {
        drawH = targetH;
        drawW = targetH * imgAspect;
      } else {
        drawW = targetW;
        drawH = targetW / imgAspect;
      }

      drawW *= zoom;
      drawH *= zoom;

      const panX = offsetX * (targetW * 0.45);
      const panY = offsetY * (targetH * 0.45);

      octx.drawImage(img, -drawW / 2 + panX, -drawH / 2 + panY, drawW, drawH);
      octx.restore();

      // Apply filter & adjustments
      const hasAdjustment =
        filterId !== 'original' ||
        adjustments.brightness !== 0 ||
        adjustments.contrast !== 0 ||
        adjustments.saturation !== 0 ||
        adjustments.warmth !== 0 ||
        adjustments.exposure !== 0;

      if (hasAdjustment) {
        applyPixelFilterAndAdjustments(off, filterId, adjustments);
      }

      ctx.drawImage(off, rx, ry, slot.w, slot.h);

      // Subtle retro vignette for retro-film or vintage
      if (filterId === 'retro-film' || filterId === 'vintage') {
        const vig = ctx.createRadialGradient(0, 0, slot.w * 0.25, 0, 0, slot.w * 0.85);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(38, 22, 12, 0.28)');
        ctx.fillStyle = vig;
        ctx.fillRect(rx, ry, slot.w, slot.h);
      }
    }
  } catch {
    ctx.fillStyle = frame.secondaryColor;
    ctx.fillRect(rx, ry, slot.w, slot.h);
  }

  ctx.restore();

  // Optional crisp border around slot
  ctx.save();
  ctx.translate(cx, cy);
  if (slot.rotation) ctx.rotate((slot.rotation * Math.PI) / 180);
  ctx.strokeStyle =
    frame.studioId === 'coquette-room'
      ? 'rgba(255, 255, 255, 0.85)'
      : frame.studioId === 'color-pop'
        ? '#68525D'
        : 'rgba(104, 82, 93, 0.18)';
  ctx.lineWidth = frame.studioId === 'color-pop' ? 4 : 2;
  ctx.beginPath();
  ctx.roundRect(rx, ry, slot.w, slot.h, cornerRadius);
  ctx.stroke();
  ctx.restore();
}

export async function renderPhotoboothToCanvas(
  project: PhotoboothProjectState,
  targetCanvas?: HTMLCanvasElement,
  scale = 1
): Promise<HTMLCanvasElement> {
  const layout = getLayoutById(project.layoutId);
  const frame = getFrameById(project.frameId);
  const { width, height } = getCanvasDimensions(layout.id);

  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.scale(scale, scale);

  // 1. Frame background & studio textures
  drawFrameBackground(ctx, frame, layout.id, width, height);

  // 2. Photo slots
  const slots = computeLayoutSlots(layout.id, width, height);
  for (let i = 0; i < slots.length; i++) {
    const photo =
      project.photos.length > 0
        ? project.photos[i % project.photos.length]
        : undefined;
    await drawSinglePhotoSlot(
      ctx,
      photo,
      slots[i],
      frame,
      project.filterId,
      project.adjustments
    );
  }

  // 3. Frame decorations (bows, tape, studio header)
  drawFrameDecorationsOverSlots(ctx, frame, slots, width, height);

  // 4. Footer caption & date stamp
  const footerCenterY = height - 115;
  ctx.fillStyle = frame.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const captionText = project.footerCaption?.trim() || frame.defaultFooterText;
  if (frame.studioId === 'scrapbook-lab' || frame.studioId === 'coquette-room') {
    ctx.font = '700 40px "Caveat", cursive';
  } else if (frame.studioId === 'retro-corner') {
    ctx.font = '500 24px "JetBrains Mono", monospace';
  } else {
    ctx.font = '800 30px "Bricolage Grotesque", "Plus Jakarta Sans", sans-serif';
  }
  ctx.fillText(captionText, width / 2, footerCenterY - (project.showDateStamp ? 22 : 0));

  if (project.showDateStamp) {
    const dateStr =
      project.customDateText?.trim() ||
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    if (frame.studioId === 'retro-corner') {
      ctx.fillStyle = '#F59E42';
      ctx.font = '500 26px "JetBrains Mono", monospace';
    } else {
      ctx.fillStyle = frame.textColor;
      ctx.globalAlpha = 0.72;
      ctx.font = '500 22px "JetBrains Mono", monospace';
    }
    ctx.fillText(dateStr, width / 2, footerCenterY + 26);
    ctx.globalAlpha = 1;
  }

  // 5. Placed Stickers
  for (const placed of project.stickers) {
    const def = STICKER_LIBRARY.find((s) => s.id === placed.stickerId);
    if (!def) continue;
    ctx.save();
    ctx.translate(placed.x * width, placed.y * height);
    ctx.rotate((placed.rotation * Math.PI) / 180);
    drawStickerOnCanvas(ctx, def.drawType, 120 * placed.scale);
    ctx.restore();
  }

  // 6. Custom Texts
  for (const t of project.texts) {
    if (!t.text.trim()) continue;
    ctx.save();
    const fontMap = {
      sans: '"Plus Jakarta Sans", sans-serif',
      display: '"Bricolage Grotesque", sans-serif',
      handwriting: '"Caveat", cursive',
      mono: '"JetBrains Mono", monospace',
    };
    const pxSize = Math.round(t.fontSize * 1.45);
    ctx.font = `700 ${pxSize}px ${fontMap[t.font]}`;
    ctx.fillStyle = t.color;
    ctx.textAlign = t.align;
    ctx.textBaseline = 'middle';

    // Crisp subtle halo so text stays legible over photos
    ctx.lineWidth = 6;
    ctx.strokeStyle =
      t.color.toLowerCase() === '#ffffff' ? 'rgba(74, 55, 64, 0.55)' : 'rgba(255, 255, 255, 0.78)';
    const lines = t.text.split('\n');
    const lineH = pxSize * 1.18;
    const startY = t.y * height - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, idx) => {
      ctx.strokeText(line, t.x * width, startY + idx * lineH);
      ctx.fillText(line, t.x * width, startY + idx * lineH);
    });
    ctx.restore();
  }

  ctx.restore();
  return canvas;
}
