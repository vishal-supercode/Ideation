import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar';
import KatsuraIntro from './components/KatsuraIntro';
import GtrScrollyCanvas from './components/GtrScrollyCanvas';
import AudioLabSection from './components/AudioLabSection';
import { gtrAudio } from './utils/audioEngine';
import Footer from './components/Footer';
export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 0.8,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  useEffect(() => {
    return gtrAudio.subscribe((state) => {
      setSoundEnabled(state.isEngineRunning || state.isStarting);
    });
  }, []);

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el, { duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF5E00] selection:text-white relative overflow-x-clip">
      <Navbar 
        onNavigate={handleNavigate}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Scrollytelling Pinned Canvas Experience (Beats 1 through 5) */}
      <main className="relative z-10">
        <KatsuraIntro />
        <GtrScrollyCanvas />

        {/* Acoustic Harmonics & VR38DETT Engine Rev Lab */}
        <AudioLabSection 
          soundEnabled={soundEnabled} 
          setSoundEnabled={setSoundEnabled} 
        />
      </main>
      <Footer/>
    </div>
  );
}
