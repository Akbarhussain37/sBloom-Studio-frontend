import React, { useEffect, useRef } from 'react';

export default function PulsenovaHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    // Loop duration in seconds (18s ambient loop)
    const LOOP_DURATION = 18000; 

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (now: number) => {
      const elapsed = (now - startTime) % LOOP_DURATION;
      const progress = (elapsed / LOOP_DURATION) * Math.PI * 2; // 0 to 2PI

      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Base cream background
      ctx.fillStyle = '#F4F1EA';
      ctx.fillRect(0, 0, width, height);

      // Helper for smooth harmonic wave oscillation
      const osc = (freq: number, phase: number = 0) => Math.sin(progress * freq + phase);
      const cosc = (freq: number, phase: number = 0) => Math.cos(progress * freq + phase);

      // --- RIBBON LAYER 1: Top-Left Soft Background Wave ---
      {
        const g1 = ctx.createLinearGradient(
          width * 0.1, 
          height * 0.0, 
          width * 0.6, 
          height * 0.7
        );
        g1.addColorStop(0, '#FAF8F4');
        g1.addColorStop(0.4, '#EBE5D9');
        g1.addColorStop(1, '#D8D0BF');

        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.moveTo(-width * 0.2, -height * 0.1);
        ctx.bezierCurveTo(
          width * (0.25 + 0.04 * osc(1, 0)),
          height * (0.05 + 0.03 * cosc(1, 0.5)),
          width * (0.35 + 0.05 * cosc(1, 1)),
          height * (0.45 + 0.04 * osc(1, 1.5)),
          width * 0.75,
          -height * 0.2
        );
        ctx.lineTo(width * 1.2, -height * 0.2);
        ctx.lineTo(-width * 0.2, -height * 0.2);
        ctx.closePath();
        ctx.fill();
      }

      // --- RIBBON LAYER 2: Wide Main Diagonal Silk Ribbon ---
      {
        const g2 = ctx.createLinearGradient(
          width * 0.0, 
          height * 0.2, 
          width * 0.9, 
          height * 0.9
        );
        g2.addColorStop(0, 'rgba(250, 248, 244, 0.95)');
        g2.addColorStop(0.35, 'rgba(238, 232, 222, 0.9)');
        g2.addColorStop(0.7, 'rgba(218, 210, 196, 0.85)');
        g2.addColorStop(1, 'rgba(196, 187, 172, 0.75)');

        ctx.fillStyle = g2;
        ctx.beginPath();
        
        // Upper edge curve
        const topYShift = height * (0.04 * osc(1, 0.8));
        const botYShift = height * (0.05 * cosc(1, 2.0));
        
        ctx.moveTo(-width * 0.15, height * (0.15 + 0.03 * osc(1, 0.2)));
        ctx.bezierCurveTo(
          width * (0.18 + 0.03 * osc(1, 1.2)),
          height * (0.2 + 0.04 * cosc(1, 0.4)) + topYShift,
          width * (0.45 + 0.04 * cosc(1, 1.8)),
          height * (0.55 + 0.05 * osc(1, 2.5)) + topYShift,
          width * 1.15,
          height * (0.8 + 0.03 * cosc(1, 1.0))
        );

        // Lower edge curve (connecting back)
        ctx.bezierCurveTo(
          width * (0.7 + 0.04 * osc(1, 2.2)),
          height * (0.95 + 0.04 * cosc(1, 1.4)) + botYShift,
          width * (0.35 + 0.05 * cosc(1, 0.7)),
          height * (0.75 + 0.05 * osc(1, 0.3)) + botYShift,
          -width * 0.15,
          height * (0.55 + 0.04 * osc(1, 1.6))
        );
        ctx.closePath();
        ctx.fill();
      }

      // --- RIBBON LAYER 3: Soft Sweeping Fore-Ribbon (Bottom-Left to Center) ---
      {
        const g3 = ctx.createLinearGradient(
          width * -0.1,
          height * 0.5,
          width * 0.7,
          height * 1.1
        );
        g3.addColorStop(0, 'rgba(247, 244, 238, 0.9)');
        g3.addColorStop(0.5, 'rgba(230, 223, 210, 0.75)');
        g3.addColorStop(1, 'rgba(205, 196, 181, 0.6)');

        ctx.fillStyle = g3;
        ctx.beginPath();
        ctx.moveTo(-width * 0.2, height * (0.4 + 0.03 * cosc(1, 1.5)));
        ctx.bezierCurveTo(
          width * (0.15 + 0.04 * osc(1, 0.9)),
          height * (0.5 + 0.04 * osc(1, 2.1)),
          width * (0.4 + 0.03 * cosc(1, 1.3)),
          height * (0.85 + 0.03 * cosc(1, 0.5)),
          width * 0.85,
          height * 1.15
        );
        ctx.lineTo(-width * 0.2, height * 1.2);
        ctx.closePath();
        ctx.fill();
      }

      // --- RIBBON LAYER 4: Soft Top-Right Framing Shadow Ribbon ---
      {
        const g4 = ctx.createLinearGradient(
          width * 0.6,
          height * -0.1,
          width * 1.1,
          height * 0.7
        );
        g4.addColorStop(0, 'rgba(215, 206, 191, 0.55)');
        g4.addColorStop(0.6, 'rgba(238, 233, 224, 0.7)');
        g4.addColorStop(1, 'rgba(249, 247, 242, 0.9)');

        ctx.fillStyle = g4;
        ctx.beginPath();
        ctx.moveTo(width * 0.45, -height * 0.1);
        ctx.bezierCurveTo(
          width * (0.6 + 0.03 * osc(1, 2.5)),
          height * (0.2 + 0.03 * cosc(1, 1.1)),
          width * (0.85 + 0.04 * cosc(1, 0.4)),
          height * (0.4 + 0.04 * osc(1, 1.9)),
          width * 1.15,
          height * (0.65 + 0.03 * cosc(1, 2.8))
        );
        ctx.lineTo(width * 1.2, -height * 0.2);
        ctx.closePath();
        ctx.fill();
      }

      // --- SOFT VIGNETTE & LIGHT HIGHLIGHT OVERLAY ---
      const vignette = ctx.createRadialGradient(
        width * 0.5, height * 0.4, width * 0.2,
        width * 0.5, height * 0.5, width * 0.85
      );
      vignette.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      vignette.addColorStop(0.6, 'rgba(244, 241, 234, 0.0)');
      vignette.addColorStop(1, 'rgba(180, 170, 155, 0.08)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* 2D Canvas ambient liquid silk ribbon renderer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
      />

      {/* Subtle Film Grain Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-multiply z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
