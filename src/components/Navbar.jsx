import { useState, useEffect, useRef } from 'react';
import { Menu, X, Volume2, VolumeX, Power } from 'lucide-react';
import { gtrAudio } from '../utils/audioEngine';

export default function Navbar({ onNavigate, setSoundEnabled }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [engineActive, setEngineActive] = useState(false);
  const [introActive, setIntroActive] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const previousScrollYRef = useRef(0);
  const introWasActiveRef = useRef(true);

  useEffect(() => {
    const updateScrollState = () => {
      const currentY = window.scrollY;
      const intro = document.getElementById('katsura-intro');
      const rect = intro?.getBoundingClientRect();
      const isIntroActive = rect ? rect.bottom > 0 && rect.top < window.innerHeight : false;
      const introJustEnded = introWasActiveRef.current && !isIntroActive;

      setScrolled(currentY > 40);
      setIntroActive(isIntroActive);

      if (isIntroActive) {
        setNavVisible(false);
      } else if (introJustEnded) {
        setNavVisible(true);
      } else {
        const delta = currentY - previousScrollYRef.current;
        if (Math.abs(delta) > 4) setNavVisible(delta < 0);
      }

      introWasActiveRef.current = isIntroActive;
      previousScrollYRef.current = currentY;
    };
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  useEffect(() => {
    return gtrAudio.subscribe((state) => {
      const active = state.isEngineRunning || state.isStarting;
      setEngineActive(active);
      if (setSoundEnabled) setSoundEnabled(active);
    });
  }, [setSoundEnabled]);

  const toggleSound = () => {
    gtrAudio.toggleEngine();
  };

  const navLinks = [
    { label: 'Overview', id: 'scrolly-top' },
    { label: 'Audio Lab', id: 'audio-section' },
  ];

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${introActive || !navVisible ? 'pointer-events-none -translate-y-full opacity-0' : 'translate-y-0 opacity-100'} ${
        scrolled
          ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/8 shadow-2xl py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div 
          onClick={() => handleLinkClick('scrolly-top')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex items-center tracking-widest text-xs uppercase font-semibold text-white/50 group-hover:text-white/80 transition-colors">
            NISSAN
          </div>
          <span className="h-3.5 w-px bg-white/20"></span>
          <div className="flex items-center gap-1">
            <span className="text-base font-extrabold tracking-tighter text-white font-['Space_Grotesk']">
              GT<span className="text-[#FF5E00]">-</span>R
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/6 text-[#00D6FF] border border-[#00D6FF]/30 tracking-wider hidden sm:inline-block">
              VR38
            </span>
          </div>
        </div>

        {/* Center: Apple-style Minimal Navigation */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-medium tracking-wide">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.id)}
              className="text-white/60 hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#00D6FF] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Engine Ignition Button in Navbar */}
          <button
            onClick={toggleSound}
            aria-label={engineActive ? "Stop Engine" : "Start Engine"}
            title={engineActive ? "Click to Stop Engine" : "Click to Start VR38 Engine"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 border ${
              engineActive
                ? 'bg-red-600/20 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(255,40,20,0.4)]'
                : 'bg-white/4 border-white/10 text-white/60 hover:text-white hover:bg-white/8'
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${engineActive ? 'text-red-400' : 'text-white/50'}`} />
            <span className="hidden sm:inline">{engineActive ? 'ENGINE ON' : 'START'}</span>
          </button>

          {/* Engine Sound Toggle Icon */}
          <button
            onClick={toggleSound}
            aria-label={engineActive ? "Mute engine sound" : "Enable engine sound"}
            title={engineActive ? "Engine Audio Active" : "Start VR38 Engine"}
            className={`p-2 rounded-full transition-all duration-300 border ${
              engineActive
                ? 'bg-[#FF5E00]/15 border-[#FF5E00]/50 text-[#FFA048] shadow-[0_0_15px_rgba(255,94,0,0.35)]'
                : 'bg-white/4 border-white/10 text-white/50 hover:text-white/90 hover:bg-white/8'
            }`}
          >
            {engineActive ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-white/70 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-6 py-6 mt-3 space-y-4 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left py-2 text-sm font-medium text-white/70 hover:text-white border-b border-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={toggleSound}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-2 border ${
                engineActive
                  ? 'bg-red-600/30 border-red-500 text-red-300'
                  : 'bg-white/8 border-white/20 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{engineActive ? 'STOP ENGINE (RUNNING)' : 'START ENGINE'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
