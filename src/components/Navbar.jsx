import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { gtrAudio } from '../utils/audioEngine';

export default function Navbar({ onNavigate, soundEnabled, setSoundEnabled }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    if (soundEnabled) {
      gtrAudio.stop();
      setSoundEnabled(false);
    } else {
      gtrAudio.start();
      setSoundEnabled(true);
    }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
          {/* Engine Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute engine sound" : "Enable engine sound"}
            title={soundEnabled ? "Engine Audio Active" : "Unmute VR38DETT Engine Sound"}
            className={`p-2 rounded-full transition-all duration-300 border ${
              soundEnabled
                ? 'bg-[#FF5E00]/15 border-[#FF5E00]/50 text-[#FFA048] shadow-[0_0_15px_rgba(255,94,0,0.35)]'
                : 'bg-white/4 border-white/10 text-white/50 hover:text-white/90 hover:bg-white/8'
            }`}
          >
            {soundEnabled ? (
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
        </div>
      )}
    </header>
  );
}
