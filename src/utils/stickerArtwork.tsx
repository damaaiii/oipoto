import React from 'react';
import { StickerDefinition } from '../types/photobooth';

export function drawStickerOnCanvas(
  ctx: CanvasRenderingContext2D,
  drawType: StickerDefinition['drawType'],
  size: number
) {
  ctx.save();
  const s = size / 100;
  ctx.scale(s, s);
  ctx.translate(-50, -50);

  switch (drawType) {
    case 'heart-pink': {
      ctx.fillStyle = '#F28CB1';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, 82);
      ctx.bezierCurveTo(15, 58, 12, 28, 32, 20);
      ctx.bezierCurveTo(44, 15, 50, 27, 50, 32);
      ctx.bezierCurveTo(50, 27, 56, 15, 68, 20);
      ctx.bezierCurveTo(88, 28, 85, 58, 50, 82);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(32, 34, 6, 3.5, -0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'heart-outline': {
      ctx.strokeStyle = '#C84B78';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(50, 82);
      ctx.bezierCurveTo(14, 58, 12, 27, 32, 20);
      ctx.bezierCurveTo(44, 16, 50, 28, 50, 33);
      ctx.bezierCurveTo(50, 28, 56, 16, 68, 20);
      ctx.bezierCurveTo(88, 27, 86, 58, 50, 82);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'heart-double': {
      const drawMiniHeart = (cx: number, cy: number, sc: number, fill: string) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(sc, sc);
        ctx.fillStyle = fill;
        ctx.strokeStyle = '#68525D';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 28);
        ctx.bezierCurveTo(-30, 8, -32, -20, -14, -26);
        ctx.bezierCurveTo(-4, -29, 0, -18, 0, -14);
        ctx.bezierCurveTo(0, -18, 4, -29, 14, -26);
        ctx.bezierCurveTo(32, -20, 30, 8, 0, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };
      drawMiniHeart(38, 56, 0.85, '#F6CAD8');
      drawMiniHeart(66, 38, 0.65, '#E7DDF3');
      break;
    }
    case 'star-four': {
      ctx.fillStyle = '#FFE49E';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(50, 10);
      ctx.quadraticCurveTo(54, 46, 90, 50);
      ctx.quadraticCurveTo(54, 54, 50, 90);
      ctx.quadraticCurveTo(46, 54, 10, 50);
      ctx.quadraticCurveTo(46, 46, 50, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'star-chubby': {
      ctx.fillStyle = '#F6CAD8';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerA = outerA + Math.PI / 5;
        const ox = 50 + Math.cos(outerA) * 38;
        const oy = 50 + Math.sin(outerA) * 38;
        const ix = 50 + Math.cos(innerA) * 19;
        const iy = 50 + Math.sin(innerA) * 19;
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#68525D';
      ctx.beginPath();
      ctx.arc(43, 49, 2.5, 0, Math.PI * 2);
      ctx.arc(57, 49, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'star-cluster': {
      const draw4 = (cx: number, cy: number, r: number, col: string) => {
        ctx.fillStyle = col;
        ctx.strokeStyle = '#68525D';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(cx + r * 0.15, cy - r * 0.15, cx + r, cy);
        ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.15, cx, cy + r);
        ctx.quadraticCurveTo(cx - r * 0.15, cy + r * 0.15, cx - r, cy);
        ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 0.15, cx, cy - r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };
      draw4(42, 46, 26, '#E7DDF3');
      draw4(74, 28, 15, '#FFE49E');
      draw4(70, 72, 13, '#F6CAD8');
      break;
    }
    case 'flower-daisy': {
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.save();
        ctx.translate(50 + Math.cos(a) * 20, 50 + Math.sin(a) * 20);
        ctx.rotate(a);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#FFD97D';
      ctx.beginPath();
      ctx.arc(50, 50, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'flower-blossom': {
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        ctx.fillStyle = '#FCE7ED';
        ctx.beginPath();
        ctx.arc(50 + Math.cos(a) * 21, 50 + Math.sin(a) * 21, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#F28CB1';
      ctx.beginPath();
      ctx.arc(50, 50, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'ribbon-pink':
    case 'ribbon-lavender': {
      const fill = drawType === 'ribbon-pink' ? '#F6CAD8' : '#E7DDF3';
      ctx.fillStyle = fill;
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      // Tails
      ctx.beginPath();
      ctx.moveTo(45, 52);
      ctx.lineTo(25, 84);
      ctx.lineTo(36, 78);
      ctx.lineTo(42, 87);
      ctx.lineTo(50, 54);
      ctx.lineTo(58, 87);
      ctx.lineTo(64, 78);
      ctx.lineTo(75, 84);
      ctx.lineTo(55, 52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Left loop
      ctx.beginPath();
      ctx.moveTo(46, 46);
      ctx.bezierCurveTo(10, 18, 10, 62, 46, 52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Right loop
      ctx.beginPath();
      ctx.moveTo(54, 46);
      ctx.bezierCurveTo(90, 18, 90, 62, 54, 52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Center knot
      ctx.beginPath();
      ctx.arc(50, 48, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'bow-coquette':
    case 'bow-cream': {
      const fill = drawType === 'bow-coquette' ? '#F28CB1' : '#FFF6EC';
      ctx.fillStyle = fill;
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 3.8;
      ctx.lineJoin = 'round';
      // Flowing ribbon tails
      ctx.beginPath();
      ctx.moveTo(46, 52);
      ctx.quadraticCurveTo(32, 72, 24, 86);
      ctx.lineTo(36, 82);
      ctx.quadraticCurveTo(44, 68, 50, 55);
      ctx.quadraticCurveTo(56, 68, 64, 82);
      ctx.lineTo(76, 86);
      ctx.quadraticCurveTo(68, 72, 54, 52);
      ctx.fill();
      ctx.stroke();
      // Loops
      ctx.beginPath();
      ctx.moveTo(48, 46);
      ctx.bezierCurveTo(14, 14, 8, 56, 46, 50);
      ctx.moveTo(52, 46);
      ctx.bezierCurveTo(86, 14, 92, 56, 54, 50);
      ctx.fill();
      ctx.stroke();
      // Center pearl
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(50, 48, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'cherry-pair': {
      // Stems
      ctx.strokeStyle = '#5E8C61';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(32, 60);
      ctx.quadraticCurveTo(42, 26, 54, 16);
      ctx.quadraticCurveTo(64, 34, 68, 62);
      ctx.stroke();
      // Leaf
      ctx.fillStyle = '#9ED2A1';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(63, 21, 13, 7, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Cherries
      const drawBerry = (cx: number, cy: number) => {
        ctx.fillStyle = '#E05779';
        ctx.strokeStyle = '#68525D';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(cx - 5, cy - 5, 4.5, 2.5, -0.5, 0, Math.PI * 2);
        ctx.fill();
      };
      drawBerry(32, 68);
      drawBerry(68, 70);
      break;
    }
    case 'butterfly-pastel': {
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = '#E7DDF3';
      // Top wings
      ctx.beginPath();
      ctx.ellipse(32, 38, 22, 16, -0.4, 0, Math.PI * 2);
      ctx.ellipse(68, 38, 22, 16, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Bottom wings
      ctx.fillStyle = '#F6CAD8';
      ctx.beginPath();
      ctx.ellipse(36, 65, 16, 13, 0.4, 0, Math.PI * 2);
      ctx.ellipse(64, 65, 16, 13, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Body
      ctx.fillStyle = '#68525D';
      ctx.beginPath();
      ctx.ellipse(50, 52, 4.5, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'doodle-swirl': {
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(14, 55);
      ctx.bezierCurveTo(26, 20, 48, 20, 48, 48);
      ctx.bezierCurveTo(48, 74, 28, 72, 34, 48);
      ctx.bezierCurveTo(40, 26, 72, 26, 86, 54);
      ctx.stroke();
      break;
    }
    case 'doodle-crown': {
      ctx.fillStyle = '#FFE49E';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(20, 72);
      ctx.lineTo(18, 34);
      ctx.lineTo(36, 52);
      ctx.lineTo(50, 26);
      ctx.lineTo(64, 52);
      ctx.lineTo(82, 34);
      ctx.lineTo(80, 72);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'cute-cloud': {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(34, 56, 16, Math.PI * 0.5, Math.PI * 1.6);
      ctx.arc(50, 42, 18, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(68, 56, 15, Math.PI * 1.4, Math.PI * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Cheeks + eyes
      ctx.fillStyle = '#F6CAD8';
      ctx.beginPath();
      ctx.arc(38, 60, 4, 0, Math.PI * 2);
      ctx.arc(62, 60, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#68525D';
      ctx.beginPath();
      ctx.arc(43, 55, 2.5, 0, Math.PI * 2);
      ctx.arc(57, 55, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cute-camera': {
      ctx.fillStyle = '#F6CAD8';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(16, 30, 68, 48, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E7DDF3';
      ctx.beginPath();
      ctx.roundRect(35, 20, 30, 12, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(50, 54, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#68525D';
      ctx.beginPath();
      ctx.arc(50, 54, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cute-cat': {
      ctx.fillStyle = '#FFF6EC';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(24, 42);
      ctx.lineTo(24, 20);
      ctx.lineTo(40, 34);
      ctx.quadraticCurveTo(50, 31, 60, 34);
      ctx.lineTo(76, 20);
      ctx.lineTo(76, 42);
      ctx.bezierCurveTo(84, 62, 74, 80, 50, 80);
      ctx.bezierCurveTo(26, 80, 16, 62, 24, 42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#F28CB1';
      ctx.beginPath();
      ctx.arc(35, 58, 4.5, 0, Math.PI * 2);
      ctx.arc(65, 58, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#68525D';
      ctx.beginPath();
      ctx.arc(40, 52, 3, 0, Math.PI * 2);
      ctx.arc(60, 52, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cute-smile': {
      ctx.fillStyle = '#FFE89E';
      ctx.strokeStyle = '#68525D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(50, 50, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#68525D';
      ctx.beginPath();
      ctx.arc(39, 44, 3.5, 0, Math.PI * 2);
      ctx.arc(61, 44, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(50, 52, 14, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

export const StickerPreviewIcon: React.FC<{
  drawType: StickerDefinition['drawType'];
  className?: string;
}> = ({ drawType, className = 'w-10 h-10' }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 64;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    drawStickerOnCanvas(ctx, drawType, size);
  }, [drawType]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
