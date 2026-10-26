import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function KatsuraIntro() {
  const stageRef = useRef(null);
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedScrollY = Number(sessionStorage.getItem('gtr-page-scroll-y') || 0);
    return Math.max(window.scrollY, savedScrollY) < window.innerHeight * 1.8;
  });
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 58, damping: 22, mass: 0.45 });

  const curtainY = useTransform(progress, [0, 0.5, 1], ['0%', '0%', '-108%']);
  const curtainRadius = useTransform(progress, [0, 0.78, 1], ['0px', '0px', '0px']);
  // The wordmark is centered as its base layout, then enters from the right.
  // Using viewport-relative motion keeps the crop and reveal usable on tablets.
  const wordX = useTransform(progress, [0, 0.38, 0.78], ['72vw', '0vw', '4vw']);
  const wordScale = useTransform(progress, [0, 0.38, 0.82], [1, 1, 1.06]);
  const promptOpacity = useTransform(progress, [0, 0.14], [1, 0]);
  const promptY = useTransform(progress, [0, 0.16], ['0px', '24px']);

  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('gtr-page-scroll-y', String(window.scrollY));
    };
    const updateIntroVisibility = () => {
      const stage = stageRef.current;
      if (stage) setIntroActive(window.scrollY < stage.offsetHeight);
      saveScrollPosition();
    };

    window.addEventListener('scroll', updateIntroVisibility, { passive: true });
    window.addEventListener('pagehide', saveScrollPosition);
    return () => {
      window.removeEventListener('scroll', updateIntroVisibility);
      window.removeEventListener('pagehide', saveScrollPosition);
    };
  }, []);

  return (
    <section id="katsura-intro" ref={stageRef} className="pointer-events-none absolute left-0 top-0 z-60 h-[180vh] w-full" aria-label="Nissan GT-R introduction">
      <motion.div
        className="pointer-events-auto fixed left-0 top-0 z-60 h-screen w-full overflow-hidden bg-[#FF5E00] text-[#050505]"
        style={{
          y: curtainY,
          visibility: introActive ? 'visible' : 'hidden',
          borderBottomLeftRadius: curtainRadius,
          borderBottomRightRadius: curtainRadius,
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.16)_50%,transparent_100%)]" />
        <motion.div
          className="absolute left-1/2 top-1/2 z-10 w-max -translate-x-1/2 -translate-y-1/2 select-none"
          style={{ x: wordX, scale: wordScale }}
        >
          <h1 className="flex items-center gap-[0.14em] whitespace-nowrap text-[clamp(3rem,13vw,22rem)] font-black uppercase leading-[0.82] tracking-normal">
            <span className="text-[#050505]">NISSAN</span>
            <span className="rounded-[0.1em] bg-[#050505] px-[0.14em] pb-[0.08em] text-white">GTR</span>
          </h1>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] font-bold uppercase tracking-[0.32em]"
          style={{ opacity: promptOpacity, y: promptY }}
        >
          <span>Scroll to enter</span>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ArrowDown className="h-5 w-5" strokeWidth={1.8} />
          </motion.span>
        </motion.div>

      </motion.div>
    </section>
  );
}
