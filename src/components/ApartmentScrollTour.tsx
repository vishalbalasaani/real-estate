import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 299;

export const ApartmentScrollTour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for GSAP animated text blocks
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    let isCancelled = false;
    let targetProgress = 0;
    let smoothProgress = 0;
    let lastRenderedIdx = -1;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getFrameUrl = (idx: number) => {
      const num = String(idx + 1).padStart(5, '0');
      return `/frames/frame_${num}.jpg`;
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        render(true);
      }
    };

    const drawCover = (img: ImageBitmap | HTMLImageElement) => {
      const w = canvas.width;
      const h = canvas.height;
      const imgW = (img as ImageBitmap).width || (img as HTMLImageElement).naturalWidth || 1920;
      const imgH = (img as ImageBitmap).height || (img as HTMLImageElement).naturalHeight || 1080;

      const imgRatio = imgW / imgH;
      const canvasRatio = w / h;

      let renderW: number, renderH: number, offsetX: number, offsetY: number;

      if (canvasRatio > imgRatio) {
        renderW = w;
        renderH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - renderH) / 2;
      } else {
        renderH = h;
        renderW = h * imgRatio;
        offsetX = (w - renderW) / 2;
        offsetY = 0;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    };

    const findClosestFrame = (targetIdx: number) => {
      if (frames[targetIdx]) return { frame: frames[targetIdx], index: targetIdx };
      let step = 1;
      while (targetIdx - step >= 0 || targetIdx + step < TOTAL_FRAMES) {
        if (targetIdx - step >= 0 && frames[targetIdx - step]) {
          return { frame: frames[targetIdx - step], index: targetIdx - step };
        }
        if (targetIdx + step < TOTAL_FRAMES && frames[targetIdx + step]) {
          return { frame: frames[targetIdx + step], index: targetIdx + step };
        }
        step++;
      }
      return { frame: null, index: -1 };
    };

    const render = (force = false) => {
      const targetIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(smoothProgress * (TOTAL_FRAMES - 1))));
      const { frame, index: resolvedIdx } = findClosestFrame(targetIdx);
      if (!frame) return;

      if (force || resolvedIdx !== lastRenderedIdx) {
        drawCover(frame);
        lastRenderedIdx = resolvedIdx;
      }
    };

    const loadSingleFrame = async (idx: number) => {
      if (isCancelled) return;
      const url = getFrameUrl(idx);
      try {
        if (typeof createImageBitmap === 'function') {
          const res = await fetch(url);
          const blob = await res.blob();
          if (isCancelled) return;
          frames[idx] = await createImageBitmap(blob);
        } else {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              if (!isCancelled) frames[idx] = img;
              resolve();
            };
            img.onerror = () => resolve();
            img.src = url;
          });
        }
      } catch {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (!isCancelled) frames[idx] = img;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = url;
        });
      }

      const currentIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(smoothProgress * (TOTAL_FRAMES - 1))));
      if (idx === 0 && lastRenderedIdx === -1) {
        render(true);
      } else if (idx === currentIdx) {
        render(true);
      }
    };

    const preloadAll = async () => {
      await loadSingleFrame(0);

      const queue: number[] = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        queue.push(i);
      }

      const CONCURRENCY = 8;
      const workers = [];
      for (let w = 0; w < CONCURRENCY; w++) {
        workers.push((async () => {
          while (queue.length > 0 && !isCancelled) {
            const nextIdx = queue.shift();
            if (nextIdx !== undefined) {
              await loadSingleFrame(nextIdx);
            }
          }
        })());
      }
      await Promise.all(workers);
    };

    // Smooth render tick loop
    let animationFrameId: number;
    const tick = () => {
      const delta = targetProgress - smoothProgress;
      if (Math.abs(delta) > 0.0001) {
        smoothProgress += delta * 0.12;
        render();
      } else if (smoothProgress !== targetProgress) {
        smoothProgress = targetProgress;
        render();
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    const yOffset = prefersReducedMotion ? 0 : 22;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        targetProgress = self.progress;
        const p = self.progress;

        // 1. Scene 1 — Living Hall (0.04 to 0.32, peak at 0.18)
        if (scene1Ref.current) {
          let op = 0;
          let y = yOffset;
          if (p >= 0.02 && p < 0.10) {
            const t = (p - 0.02) / 0.08;
            op = t;
            y = yOffset * (1 - t);
          } else if (p >= 0.10 && p <= 0.24) {
            op = 1;
            y = 0;
          } else if (p > 0.24 && p <= 0.32) {
            const t = (p - 0.24) / 0.08;
            op = 1 - t;
            y = -yOffset * t;
          }
          scene1Ref.current.style.opacity = String(op);
          scene1Ref.current.style.transform = `translateY(${y}px)`;
          scene1Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        }

        // 2. Scene 2 — Dining Area (0.36 to 0.65, peak at 0.50)
        if (scene2Ref.current) {
          let op = 0;
          let y = yOffset;
          if (p >= 0.36 && p < 0.44) {
            const t = (p - 0.36) / 0.08;
            op = t;
            y = yOffset * (1 - t);
          } else if (p >= 0.44 && p <= 0.57) {
            op = 1;
            y = 0;
          } else if (p > 0.57 && p <= 0.65) {
            const t = (p - 0.57) / 0.08;
            op = 1 - t;
            y = -yOffset * t;
          }
          scene2Ref.current.style.opacity = String(op);
          scene2Ref.current.style.transform = `translateY(${y}px)`;
          scene2Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        }

        // 3. Scene 3 — Overall Interior Reveal (0.69 to 0.96, peak at 0.82)
        if (scene3Ref.current) {
          let op = 0;
          let y = yOffset;
          if (p >= 0.69 && p < 0.77) {
            const t = (p - 0.69) / 0.08;
            op = t;
            y = yOffset * (1 - t);
          } else if (p >= 0.77 && p <= 0.89) {
            op = 1;
            y = 0;
          } else if (p > 0.89 && p <= 0.96) {
            const t = (p - 0.89) / 0.07;
            op = 1 - t;
            y = -yOffset * t;
          }
          scene3Ref.current.style.opacity = String(op);
          scene3Ref.current.style.transform = `translateY(${y}px)`;
          scene3Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        }
      },
    });

    window.addEventListener('resize', resize, { passive: true });

    resize();
    animationFrameId = requestAnimationFrame(tick);
    preloadAll();

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      st.kill();
    };
  }, []);

  return (
    <section id="interior-tour" ref={containerRef} className="relative w-full h-[380vh] bg-slate-950">
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Fullscreen Video Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Subtle Ambient Contrast Vignette across canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Scene 1 — Living Hall (Progress: ~0.04 to 0.32) */}
        <div
          ref={scene1Ref}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-x-0 bottom-14 sm:bottom-20 lg:bottom-24 z-20 pointer-events-none will-change-transform"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-[#c69a68] shadow-[0_0_10px_#c69a68]" />
                <span
                  className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#f3d9b8]"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,1)' }}
                >
                  Living Hall
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white leading-tight"
                style={{
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Space to live. Room to belong.
              </h2>
              <p
                className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/95 font-light leading-relaxed max-w-lg"
                style={{
                  textShadow:
                    '0 2px 8px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                A welcoming setting where everyday moments become meaningful memories.
              </p>
            </div>
          </div>
        </div>

        {/* Scene 2 — Dining Area (Progress: ~0.36 to 0.65) */}
        <div
          ref={scene2Ref}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-x-0 bottom-14 sm:bottom-20 lg:bottom-24 z-20 pointer-events-none will-change-transform"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-[#c69a68] shadow-[0_0_10px_#c69a68]" />
                <span
                  className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#f3d9b8]"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,1)' }}
                >
                  Dining Area
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white leading-tight"
                style={{
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Together is a beautiful place to be.
              </h2>
              <p
                className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/95 font-light leading-relaxed max-w-lg"
                style={{
                  textShadow:
                    '0 2px 8px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Designed for shared meals, conversations and moments worth remembering.
              </p>
            </div>
          </div>
        </div>

        {/* Scene 3 — Overall Interior Reveal (Progress: ~0.69 to 0.96) */}
        <div
          ref={scene3Ref}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-x-0 bottom-14 sm:bottom-20 lg:bottom-24 z-20 pointer-events-none will-change-transform"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-[#c69a68] shadow-[0_0_10px_#c69a68]" />
                <span
                  className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#f3d9b8]"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,1)' }}
                >
                  Overall Interior Reveal
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white leading-tight"
                style={{
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Every detail has a sense of purpose.
              </h2>
              <p
                className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/95 font-light leading-relaxed max-w-lg"
                style={{
                  textShadow:
                    '0 2px 8px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                A thoughtful balance of comfort, openness and contemporary design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
