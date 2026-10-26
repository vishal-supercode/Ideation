import { useRef, useEffect, useState, useCallback } from 'react';
import {  
  Cpu, 
  Gauge, 
  Activity, 
  Crosshair, 
  ShieldCheck, 
  CheckCircle2, 
} from 'lucide-react';
import { gtrAudio } from '../utils/audioEngine';

const TOTAL_FRAMES = 240;
const HERO_PROGRESS_AT_EXIT = 0.9;

const CHAPTERS = [
  { id: 'hero', name: '01 Hero', progress: 0.05, label: 'Assembled' },
  { id: 'engineering', name: '02 Engineering', progress: 0.28, label: 'Dismantle' },
  { id: 'powertrain', name: '03 Powertrain', progress: 0.52, label: 'Twin-Turbo V6' },
  { id: 'drivetrain', name: '04 Drivetrain', progress: 0.74, label: 'ATTESA AWD' },
  { id: 'finale', name: '05 Finale', progress: 0.88, label: 'Reassembly' },
];


export default function GtrScrollyCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Frame storage & playback refs
  const imagesRef = useRef(new Array(TOTAL_FRAMES));
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const isPlayingRef = useRef(false);

  // State
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState('hero');
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Subscribe to gtrAudio state
  useEffect(() => {
    const unsub = gtrAudio.subscribe((s) => {
      setIsEngineRunning(s.isEngineRunning);
      setIsStarting(s.isStarting);
    });
    return unsub;
  }, []);

  // Helper to format frame path
  const getFrameUrl = (index) => {
    const num = String(index + 1).padStart(3, '0');
    return `/frames/ezgif-frame-${num}.jpg`;
  };

  // Find best loaded frame so canvas NEVER goes blank
  const getBestLoadedImage = useCallback((frameIdx) => {
    const images = imagesRef.current;
    if (!images) return null;

    // Direct hit
    const exact = images[frameIdx];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return exact;
    }

    // Search nearest loaded neighbor
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = frameIdx - offset;
      if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth > 0) {
        return images[prev];
      }
      const next = frameIdx + offset;
      if (next < TOTAL_FRAMES && images[next] && images[next].complete && images[next].naturalWidth > 0) {
        return images[next];
      }
    }

    // Fallback to initial hero frame
    if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
      return images[0];
    }
    return null;
  }, []);

  // Draw a frame to canvas with aspect fit and seamless edge gradient
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    // Get best available image frame
    const img = getBestLoadedImage(frameIdx);

    // Deep corporate black background matching frame edges
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Subtle radial backlight behind the car
    const radial = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.08,
      width / 2, height / 2, width * 0.65
    );
    radial.addColorStop(0, '#0a1024');
    radial.addColorStop(0.45, '#060814');
    radial.addColorStop(1, '#050505');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    if (!img) return; // Wait for initial frame

    // Fill the canvas so the car frame reaches the hero section edges without inset gaps.
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = width;
      drawH = drawW / imgRatio;
      drawX = (width - drawW) / 2;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = drawH * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = (height - drawH) / 2;
    }

    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Completely mask and hide the "Veo" watermark in the bottom-right corner of the image
    const patchX = drawX + drawW * (3700 / 3840);
    const patchY = drawY + drawH * (2060 / 2160);
    const patchW = drawW * (140 / 3840);
    const patchH = drawH * (100 / 2160);
    ctx.fillStyle = '#050505';
    ctx.fillRect(patchX, patchY, patchW, patchH);

    // Ultra-soft vignette border fade so edges melt 100% seamlessly into the page void
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.35,
      width / 2, height / 2, Math.max(width, height) * 0.65
    );
    vignette.addColorStop(0, 'rgba(5, 5, 5, 0)');
    vignette.addColorStop(0.8, 'rgba(5, 5, 5, 0.45)');
    vignette.addColorStop(1, 'rgba(5, 5, 5, 0.95)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [getBestLoadedImage]);

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;
    const images = imagesRef.current;

    // Load first frame immediately to render initial view
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    images[0] = firstImg;

    firstImg.onload = () => {
      if (isCancelled) return;
      loadedCountRef.current = 1;
      setLoadProgress(Math.round((1 / TOTAL_FRAMES) * 100));
      drawFrame(0);
    };

    // Preload remaining frames
    let loaded = 1;
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      images[i] = img;
      img.src = getFrameUrl(i);

      img.onload = () => {
        if (isCancelled) return;
        loaded++;
        loadedCountRef.current = loaded;
        const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
        setLoadProgress(pct);
        if (loaded >= TOTAL_FRAMES - 5) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        loaded++;
        loadedCountRef.current = loaded;
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // Resize canvas for device pixel ratio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Main render / LERP loop
  useEffect(() => {
    let animId;
    const loop = () => {
      if (isPlayingRef.current) {
        // Auto-play mode
        currentFrameRef.current = (currentFrameRef.current + 0.8) % TOTAL_FRAMES;
        targetFrameRef.current = currentFrameRef.current;
      } else {
        // Scroll LERP smoothing (tuned for Lenis physics inertia)
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.01) {
          currentFrameRef.current += diff * 0.22;
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }
      }

      const frameToDraw = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      drawFrame(frameToDraw);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // Scroll listener to update target frame
  useEffect(() => {
    const handleScroll = () => {
      if (isPlayingRef.current) return; // don't override if auto-playing

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      // Keep the hero animation on its opening frame while the intro curtain is active.
      const intro = document.getElementById('katsura-intro');
      const introScrollDistance = intro ? intro.offsetHeight : 0;
      const pinnedScrollDist = container.offsetHeight - window.innerHeight - introScrollDistance;
      if (pinnedScrollDist <= 0) return;
      const scrollDist = pinnedScrollDist / HERO_PROGRESS_AT_EXIT;
      const containerTop = rect.top + window.scrollY;
      const heroScroll = Math.max(0, window.scrollY - containerTop - introScrollDistance);
      const progress = Math.max(0, Math.min(1, heroScroll / scrollDist));
      setCurrentProgress(progress);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

      // Determine active chapter
      if (progress < 0.18) setActiveChapter('hero');
      else if (progress < 0.42) setActiveChapter('engineering');
      else if (progress < 0.66) setActiveChapter('powertrain');
      else if (progress < 0.86) setActiveChapter('drivetrain');
      else setActiveChapter('finale');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to chapter with Lenis smooth scroll
  const scrollToChapter = (chapterProgress) => {
    const container = containerRef.current;
    if (!container) return;
    const intro = document.getElementById('katsura-intro');
    const introScrollDistance = intro ? intro.offsetHeight : 0;
    const pinnedScrollDist = container.offsetHeight - window.innerHeight - introScrollDistance;
    const scrollDist = pinnedScrollDist / HERO_PROGRESS_AT_EXIT;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const targetProgress = Math.min(chapterProgress, HERO_PROGRESS_AT_EXIT);
    const targetScrollY = containerTop + introScrollDistance + targetProgress * scrollDist;
    if (window.lenis) {
      window.lenis.scrollTo(targetScrollY, { duration: 1.4 });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div 
      id="scrolly-top"
      ref={containerRef} 
      className="relative w-full bg-[#050505]"
      style={{ minHeight: '640vh' }}
    >
      {/* Sticky Canvas & Viewport Container - Always visible during scroll */}
      <div 
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center z-10 bg-[#050505]"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          backgroundImage: "linear-gradient(rgba(5, 5, 5, 0.18), rgba(5, 5, 5, 0.3)), url('/Neon%20Night%20Drive%20to%20the%20City.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* The HTML5 Canvas with subtle engine chassis vibration (Pristine, no overlay over car) */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none z-0 transition-transform ${
            isStarting 
              ? 'engine-vibrate-startup' 
              : (isEngineRunning ? 'engine-vibrate-idle' : '')
          }`}
        />

        {/* Ambient Subtle Radial Gradient Background Layer */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,80,255,0.06),transparent_80%)] z-1" />

        {/* CHAPTER JUMP PILL NAVIGATION (Top Center floating) */}
        <div className="absolute top-20 sm:top-22 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-1.5 p-1 rounded-full glass-panel border border-white/10 shadow-2xl backdrop-blur-xl">
          {CHAPTERS.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.progress)}
                className={`px-3 py-1 text-[11px] font-medium tracking-wider uppercase rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white shadow-[0_0_15px_rgba(0,214,255,0.4)]'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/4'
                }`}
              >
                {ch.name}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* SYNCHRONIZED STORYTELLING BEATS OVERLAYS                   */}
        {/* ========================================================= */}

        {/* BEAT 1: HERO / INTRO (0% - 16% scroll) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-12 z-20 pointer-events-none transition-all duration-700 ${
            currentProgress <= 0.16
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
        </div>

        {/* BEAT 2: ENGINEERING REVEAL (16% - 40% scroll) */}
        <div
          className={`absolute left-4 sm:left-10 lg:left-16 top-1/2 -translate-y-1/2 max-w-sm sm:max-w-md lg:max-w-lg z-20 transition-all duration-700 pointer-events-none ${
            currentProgress > 0.16 && currentProgress <= 0.40
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Tech line indicator */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-[#00D6FF] via-[#0050FF] to-transparent" />

            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#00D6FF] uppercase mb-2">
              <Cpu className="w-3.5 h-3.5" />
              STRUCTURAL DISASSEMBLY . 02
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Precision-engineered for speed.
            </h2>

            <div className="mt-3 space-y-2.5 text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              <p>
                A rigid chassis, hand-assembled powertrain, and optimized aerodynamics deliver track-grade performance.
              </p>
              <p>
                Every component is tuned for balance, power, and control-lap after lap.
              </p>
            </div>

            {/* Technical Highlights */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#00D6FF] shrink-0" />
                <span>Takumi Cleanroom</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#00D6FF] shrink-0" />
                <span>Cd 0.26 Drag Bias</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#00D6FF] shrink-0" />
                <span>Carbon Crossmember</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#00D6FF] shrink-0" />
                <span>Plasma Cylinder Bores</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 3: TWIN-TURBO POWER & ELECTRONICS (40% - 65% scroll) */}
        <div
          className={`absolute right-4 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 max-w-sm sm:max-w-md lg:max-w-lg z-20 transition-all duration-700 pointer-events-none ${
            currentProgress > 0.40 && currentProgress <= 0.65
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-12'
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Tech line indicator */}
            <div className="absolute top-0 right-0 w-1.5 h-full bg-linear-to-b from-[#FF5E00] via-[#00D6FF] to-transparent" />

            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#FF5E00] uppercase mb-2">
              <Gauge className="w-3.5 h-3.5" />
              PEAK EXPLODED VIEW . VR38DETT
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Twin-turbo power, redefined.
            </h2>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] mt-1.5 shrink-0 shadow-[0_0_8px_#00D6FF]" />
                <p>
                  Twin turbochargers force air into every cylinder with relentless urgency.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] mt-1.5 shrink-0 shadow-[0_0_8px_#00D6FF]" />
                <p>
                  Real-time engine management adjusts to every throttle input and road condition.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5E00] mt-1.5 shrink-0 shadow-[0_0_8px_#FF5E00]" />
                <p>
                  Your power stays pure-boost, torque, and response arrive instantly.
                </p>
              </div>
            </div>

            {/* Live Telemetry Card */}
            <div className="mt-5 p-3 rounded-xl bg-black/50 border border-[#00D6FF]/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00D6FF] animate-pulse" />
                <span className="text-white/60">BOOST PRESSURE</span>
              </div>
              <span className="text-[#00D6FF] font-bold">15.2 PSI @ 6,800 RPM</span>
            </div>
          </div>
        </div>

        {/* BEAT 4: HANDLING & DRIVETRAIN (65% - 85% scroll) */}
        <div
          className={`absolute left-4 sm:left-10 lg:left-16 top-1/2 -translate-y-1/2 max-w-sm sm:max-w-md lg:max-w-lg z-20 transition-all duration-700 pointer-events-none ${
            currentProgress > 0.65 && currentProgress <= 0.85
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-[#0050FF] to-[#00D6FF]" />

            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#00D6FF] uppercase mb-2">
              <Crosshair className="w-3.5 h-3.5" />
              DYNAMIC VECTORING . ATTESA E-TS
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Immersive, lifelike control.
            </h2>

            <div className="mt-3 space-y-2.5 text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              <p>
                A high-performance drivetrain unlocks traction, balance, and feedback in every corner.
              </p>
              <p>
                Intelligent all-wheel drive distributes torque in real time, so every apex feels alive.
              </p>
            </div>

            {/* Drivetrain Specs */}
            <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span className="font-mono text-white/50">TORQUE SPLIT:</span>
                <span className="font-semibold text-white">0:100 (Rear) to 50:50 (AWD)</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span className="font-mono text-white/50">TRANSAXLE:</span>
                <span className="font-semibold text-white">GR6 Dual-Clutch 6-Speed</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span className="font-mono text-white/50">SUSPENSION:</span>
                <span className="font-semibold text-white">Bilstein DampTronic Active Valving</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 5: REASSEMBLY & FINALE CTA (85% - 100% scroll) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none transition-all duration-700 ${
            currentProgress > 0.85
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 max-w-xl shadow-2xl pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest uppercase text-[#00D6FF] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D6FF]" />
              REASSEMBLED . READY FOR TRACK
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Space_Grotesk'] leading-none">
              Feel everything. <br />
              <span className="text-gradient-cyan">Fear nothing.</span>
            </h2>

            <p className="mt-3 text-sm sm:text-lg font-light text-white/80 font-['Space_Grotesk']">
              GT-R. Designed for speed, crafted for control.
            </p>

            <p className="mt-1.5 text-xs text-white/50 max-w-sm mx-auto">
              Engineered for racetracks, highways, and everything in between.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
