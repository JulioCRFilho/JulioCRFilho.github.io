import React, { useEffect, useRef } from 'react';

interface RopePhaseCanvasProps {
  opacityLevel?: number; // 0.0 to 1.0 (subtle & translucent)
}

export const RopePhaseCanvas: React.FC<RopePhaseCanvasProps> = ({ opacityLevel = 0.22 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const opacityRef = useRef<number>(opacityLevel);
  const tRef = useRef<number>(0); // Persistent rotational time phase across all opacity updates

  // Keep opacity ref in sync with prop without re-running the animation loop
  useEffect(() => {
    opacityRef.current = opacityLevel;
  }, [opacityLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      tRef.current += 0.008; // Continuous ambient harmonic drift (never resets!)
      const t = tRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      const currentOpacity = opacityRef.current;

      // If opacity is near 0, clear and keep loop alive without heavy trig math
      if (currentOpacity <= 0.005) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth alpha mapped from 0.0 to 1.0
      const alpha = Math.min(1.0, Math.max(0.0, currentOpacity));

      // WAVE 1: Primary Rotary Carrier (Subtle Translucent Lime #adff2f)
      const baseMidY1 = height * 0.40;
      const amp1 = Math.min(65, height * 0.08);
      const freq1 = 0.0028;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#adff2f';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = '#adff2f';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y =
          baseMidY1 +
          Math.sin(x * freq1 + t) * amp1 +
          Math.cos(x * freq1 * 0.4 - t * 0.4) * (amp1 * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // WAVE 2: Secondary Phase Harmonic (Subtle Translucent Cyan #38bdf8)
      const baseMidY2 = height * 0.60;
      const amp2 = Math.min(75, height * 0.09);
      const freq2 = 0.0022;

      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 5;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y =
          baseMidY2 +
          Math.sin(x * freq2 - t * 0.6) * amp2 +
          Math.sin(x * freq2 * 1.5 + t * 0.2) * (amp2 * 0.2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // WAVE 3: High-Dimensional Rotary Harmonic (Subtle Violet #c084fc)
      const baseMidY3 = height * 0.76;
      const amp3 = Math.min(50, height * 0.07);
      const freq3 = 0.0038;

      ctx.save();
      ctx.globalAlpha = alpha * 0.75;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 4;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const y = baseMidY3 + Math.sin(x * freq3 + t * 0.8) * amp3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // DELICATE TRANSLUCENT PHASE NODES
      const nodeStep = Math.max(260, Math.floor(width / 5));
      ctx.font = '9px JetBrains Mono, monospace';

      for (let x = nodeStep * 0.7; x < width - 120; x += nodeStep) {
        const y1 =
          baseMidY1 +
          Math.sin(x * freq1 + t) * amp1 +
          Math.cos(x * freq1 * 0.4 - t * 0.4) * (amp1 * 0.3);

        // Soft translucent node point
        ctx.save();
        ctx.globalAlpha = alpha * 1.2;
        ctx.fillStyle = '#adff2f';
        ctx.beginPath();
        ctx.arc(x, y1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Phase Label
        ctx.fillStyle = 'rgba(173, 255, 47, 0.45)';
        const nodeIndex = Math.floor(x / 200);
        ctx.fillText(`e^(i·${nodeIndex}θ)`, x + 6, y1 - 6);
        ctx.restore();

        // Very faint vertical phase connector
        const y2 =
          baseMidY2 +
          Math.sin(x * freq2 - t * 0.6) * amp2 +
          Math.sin(x * freq2 * 1.5 + t * 0.2) * (amp2 * 0.2);

        ctx.save();
        ctx.globalAlpha = alpha * 0.25;
        ctx.strokeStyle = '#adff2f';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run on mount only: never restart loop or reset time t on opacity changes!

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
