import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 299;

export const ApartmentScrollTour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for animated text blocks
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
    let lastRenderedIdx = -1;
    let targetProgress = 0;
    let rafScheduled = false;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getFrameUrl = (idx: number) => {
      const num = String(idx + 1).padStart(5, '0');
      return `/frames/frame_${num}.jpg`;
    };

    // Responsive Canvas Resizing with capped DPR for maximum GPU throughput
    const resize = () => {
      if (!canvas || isCancelled) return;
      // Cap DPR to 1.25 on mobile, 2.0 on desktop to prevent VRAM choking
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targetW = Math.round(w * dpr);
      const targetH = Math.round(h * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        lastRenderedIdx = -1; // force re-render on next tick
        requestRender();
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
      ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';
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

    const render = () => {
      const targetIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(targetProgress * (TOTAL_FRAMES - 1)))
      );
      const { frame, index: resolvedIdx } = findClosestFrame(targetIdx);
      if (!frame) return;

      if (resolvedIdx !== lastRenderedIdx) {
        drawCover(frame);
        lastRenderedIdx = resolvedIdx;
      }
    };

    // On-demand rendering: only schedule RAF when frame actually needs an update
    const requestRender = () => {
      if (rafScheduled || isCancelled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        render();
      });
    };

    // Adaptive Frame Loader: Downscales on mobile to save 75% VRAM (340MB vs 2.5GB)
    const loadSingleFrame = async (idx: number): Promise<void> => {
      if (isCancelled || frames[idx]) return;
      const url = getFrameUrl(idx);
      const targetWidth = isMobile ? 720 : 1600;

      try {
        if (typeof createImageBitmap === 'function') {
          const res = await fetch(url);
          const blob = await res.blob();
          if (isCancelled) return;
          try {
            // Attempt hardware-accelerated downsampled bitmap decode
            frames[idx] = await createImageBitmap(blob, {
              resizeWidth: targetWidth,
              resizeQuality: 'medium',
            });
          } catch {
            // Fallback for Safari versions where options are unhandled
            frames[idx] = await createImageBitmap(blob);
          }
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
        // Fallback Image element on network error/abort
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

      // If user is currently looking at this frame range, immediately render it
      const currentIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(targetProgress * (TOTAL_FRAMES - 1)))
      );
      if (idx === 0 && lastRenderedIdx === -1) {
        requestRender();
      } else if (Math.abs(idx - currentIdx) <= 2) {
        requestRender();
      }
    };

    // Tiered Preloader:
    // 1. Tier 1 (Stride 10): 30 frames loaded in < 0.5s -> Instant full scrollability
    // 2. Tier 2 (Stride 3):  70 frames loaded -> Ultra-smooth 30fps scrub
    // 3. Tier 3 (Remaining): Background idle load with low concurrency
    const preloadAll = async () => {
      // Step 1: Instant First Frame
      await loadSingleFrame(0);

      // Step 2: Tier 1 - Keyframes every 10 frames (instant skeleton)
      const tier1Queue: number[] = [];
      for (let i = 10; i < TOTAL_FRAMES; i += 10) {
        tier1Queue.push(i);
      }
      if (tier1Queue[tier1Queue.length - 1] !== TOTAL_FRAMES - 1) {
        tier1Queue.push(TOTAL_FRAMES - 1);
      }

      const runWorkerPool = async (queue: number[], concurrency: number) => {
        const workers = [];
        for (let w = 0; w < concurrency; w++) {
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

      // Load Tier 1 with concurrency 3 (finishes in ~300-500ms)
      await runWorkerPool(tier1Queue, 3);
      if (isCancelled) return;

      // Step 3: Tier 2 - Keyframes every 3 frames
      const tier2Queue: number[] = [];
      for (let i = 3; i < TOTAL_FRAMES; i += 3) {
        if (!frames[i]) tier2Queue.push(i);
      }
      await runWorkerPool(tier2Queue, 2);
      if (isCancelled) return;

      // Step 4: Tier 3 - Remaining in-between frames (low background concurrency)
      const tier3Queue: number[] = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (!frames[i]) tier3Queue.push(i);
      }
      await runWorkerPool(tier3Queue, 2);
    };

    const yOffset = prefersReducedMotion ? 0 : 20;

    // Direct, zero-lag ScrollTrigger with reactive scrub
    // (no double-lerp, immediate touch synchronization)
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isMobile ? 0.2 : 0.35,
      onUpdate: (self) => {
        targetProgress = self.progress;
        requestRender();

        const p = self.progress;

        // 1. Scene 1 — Living Hall (0.02 to 0.32, peak at 0.10 - 0.24)
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
          scene1Ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
          scene1Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        }

        // 2. Scene 2 — Dining Area (0.36 to 0.65, peak at 0.44 - 0.57)
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
          scene2Ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
          scene2Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        }

        // 3. Scene 3 — Overall Interior Reveal (0.69 to 0.96, peak at 0.77 - 0.89)
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
          scene3Ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
          scene3Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        }
      },
    });

    window.addEventListener('resize', resize, { passive: true });

    resize();
    preloadAll();

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resize);
      st.kill();
    };
  }, []);

  return (
    <section
      id="interior-tour"
      ref={containerRef}
      className="relative w-full h-[360vh] bg-slate-950"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen min-h-[100dvh] overflow-hidden">
        {/* Fullscreen Video Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block will-change-transform"
        />

        {/* Ambient Contrast Vignette across canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

        {/* Scene 1 — Living Hall (Progress: ~0.02 to 0.32) */}
        <div
          ref={scene1Ref}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-x-0 bottom-12 sm:bottom-20 lg:bottom-24 z-20 pointer-events-none will-change-transform"
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
                className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white leading-tight"
                style={{
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Space to live. Room to belong.
              </h2>
              <p
                className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-white/95 font-light leading-relaxed max-w-lg"
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
          className="absolute inset-x-0 bottom-12 sm:bottom-20 lg:bottom-24 z-20 pointer-events-none will-change-transform"
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
                className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white leading-tight"
                style={{
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Together is a beautiful place to be.
              </h2>
              <p
                className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-white/95 font-light leading-relaxed max-w-lg"
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
          className="absolute inset-x-0 bottom-12 sm:bottom-20 lg:bottom-24 z-20 pointer-events-none will-change-transform"
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
                className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white leading-tight"
                style={{
                  textShadow:
                    '0 2px 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,1)',
                }}
              >
                Every detail has a sense of purpose.
              </h2>
              <p
                className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-white/95 font-light leading-relaxed max-w-lg"
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
