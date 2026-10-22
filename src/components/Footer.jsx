import React from 'react';
import { ArrowUp, Award, Globe, Shield } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020203] text-white/50 pt-20 pb-12 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heritage Timeline Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#FF5E00] to-[#0050FF] flex items-center justify-center text-white font-black font-['Space_Grotesk'] text-lg shadow-lg">
              GT-R
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wide">
                NISSAN PERFORMANCE HERITAGE
              </div>
              <div className="text-xs text-white/50">
                Over five decades of Nürburgring records, Super GT championships, and relentless innovation.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('scrolly-top')}
              className="px-4 py-2 rounded-full glass-panel border border-white/10 text-xs text-white hover:text-[#00D6FF] transition-colors"
            >
              Replay Exploded View
            </button>
            <button
              onClick={() => onNavigate && onNavigate('configurator-section')}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white hover:shadow-[0_0_20px_rgba(0,214,255,0.4)] transition-all"
            >
              Configure Now
            </button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-xs">
          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4 font-mono text-[11px]">
              ENGINEERING
            </div>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('scrolly-top')} className="hover:text-white transition-colors">Exploded View Architecture</button></li>
              <li><button onClick={() => onNavigate('engineering-section')} className="hover:text-white transition-colors">VR38DETT Cleanroom Assembly</button></li>
              <li><button onClick={() => onNavigate('engineering-section')} className="hover:text-white transition-colors">ATTESA E-TS All-Wheel Drive</button></li>
              <li><button onClick={() => onNavigate('engineering-section')} className="hover:text-white transition-colors">Bilstein DampTronic Dynamics</button></li>
              <li><button onClick={() => onNavigate('powertrain-section')} className="hover:text-white transition-colors">Plasma-Coated Cylinder Bores</button></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4 font-mono text-[11px]">
              EXPERIENCE
            </div>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('audio-section')} className="hover:text-white transition-colors">Sound of VR38DETT Engine Lab</button></li>
              <li><button onClick={() => onNavigate('powertrain-section')} className="hover:text-white transition-colors">Interactive Dyno Simulator</button></li>
              <li><button onClick={() => onNavigate('configurator-section')} className="hover:text-white transition-colors">Katsura Orange Color Studio</button></li>
              <li><button onClick={() => onNavigate('specs-section')} className="hover:text-white transition-colors">NISMO Track Edition Benchmark</button></li>
              <li><button onClick={() => onNavigate('configurator-section')} className="hover:text-white transition-colors">Request VIP Allocation</button></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4 font-mono text-[11px]">
              OWNERSHIP
            </div>
            <ul className="space-y-2.5">
              <li><span className="hover:text-white transition-colors cursor-pointer">Nissan Certified GT-R Technicians</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Takumi Warranty Coverage</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Official NISMO Accessories</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Performance Driving Clinics</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Owner Community Portal</span></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-4 font-mono text-[11px]">
              NISSAN GLOBAL
            </div>
            <ul className="space-y-2.5">
              <li><span className="hover:text-white transition-colors cursor-pointer">Nissan Motor Corporation</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Nissan Motorsports (NISMO)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Yokohama Engine Plant</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tochigi Assembly Facility</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Press & Media Center</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="text-white/80 font-medium">© {new Date().getFullYear()} Nissan Motor Co., Ltd. All rights reserved.</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Legal Terms</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
