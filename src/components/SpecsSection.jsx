import React, { useState } from 'react';
import { Table, Check, Download, Layers, ShieldCheck, Zap } from 'lucide-react';

const SPECS_DATA = [
  {
    category: 'POWERTRAIN & PERFORMANCE',
    items: [
      { name: 'Engine Type', premium: 'VR38DETT 3.8L Twin-Turbo 24V V6', nismo: 'VR38DETT with GT3-Spec Turbos' },
      { name: 'Horsepower', premium: '565 HP @ 6,800 RPM', nismo: '600 HP @ 6,800 RPM' },
      { name: 'Torque', premium: '467 lb-ft @ 3,300–5,800 RPM', nismo: '481 lb-ft @ 3,600–5,600 RPM' },
      { name: '0–60 MPH', premium: '2.7 Seconds', nismo: '2.5 Seconds' },
      { name: 'Top Speed', premium: '205 MPH (330 km/h)', nismo: '205 MPH (Track Calibrated)' },
      { name: 'Turbine Configuration', premium: 'Parallel Twin IHI Turbochargers', nismo: 'NISMO GT3 Competition 10-Vane Turbos' },
      { name: 'Bore & Stroke', premium: '95.5 mm x 88.4 mm', nismo: '95.5 mm x 88.4 mm' },
      { name: 'Compression Ratio', premium: '9.0:1', nismo: '9.0:1' },
      { name: 'Assembly', premium: 'Handcrafted by Takumi Craftsman', nismo: 'Handcrafted by Takumi Craftsman' },
    ],
  },
  {
    category: 'DRIVETRAIN & TRANSMISSION',
    items: [
      { name: 'Transmission', premium: 'GR6 Dual-Clutch 6-Speed Transaxle', nismo: 'GR6 Dual-Clutch 6-Speed with R-Mode' },
      { name: 'Shift Logic', premium: 'Paddle-Activated Triple-Mode (Normal, R, Snow)', nismo: 'Aggressive R-Mode Race Calibrated' },
      { name: 'All-Wheel Drive System', premium: 'ATTESA E-TS All-Wheel Drive', nismo: 'ATTESA E-TS All-Wheel Drive' },
      { name: 'Torque Split', premium: '100% Rear to 50:50 Dynamic', nismo: '100% Rear to 50:50 Dynamic' },
      { name: 'Differential', premium: '1.5-Way Mechanical Rear LSD', nismo: '1.5-Way Mechanical Rear LSD' },
      { name: 'Propeller Shafts', premium: 'Twin Carbon-Composite Driveshafts', nismo: 'Twin Carbon-Composite Driveshafts' },
    ],
  },
  {
    category: 'CHASSIS, SUSPENSION & BRAKES',
    items: [
      { name: 'Front Suspension', premium: 'Double-Wishbone with Aluminum Arms', nismo: 'NISMO-Tuned Double-Wishbone with Increased Camber' },
      { name: 'Rear Suspension', premium: 'Multi-Link with Die-Cast Aluminum Subframe', nismo: 'Multi-Link with Carbon-Composite Stabilizer Bar' },
      { name: 'Active Damping', premium: 'Bilstein® DampTronic 3-Mode Adaptive', nismo: 'Bilstein® DampTronic NISMO Racing Circuit Valving' },
      { name: 'Front Brakes', premium: 'Brembo® 390mm 6-Piston Floating Rotors', nismo: 'Brembo® 410mm Carbon Ceramic Rotors' },
      { name: 'Rear Brakes', premium: 'Brembo® 380mm 4-Piston Floating Rotors', nismo: 'Brembo® 390mm Carbon Ceramic Rotors' },
      { name: 'Tires', premium: 'Dunlop SP Sport MAXX GT600 DSST CTT', nismo: 'Dunlop SP Sport MAXX NISMO Formula Compound' },
    ],
  },
  {
    category: 'AERODYNAMICS & DIMENSIONS',
    items: [
      { name: 'Aerodynamic Drag', premium: 'Cd 0.26', nismo: 'Cd 0.26 with +220 lbs Downforce' },
      { name: 'Curb Weight', premium: '3,865 lbs (1,753 kg)', nismo: '3,750 lbs (1,701 kg - Carbon diet)' },
      { name: 'Weight Distribution', premium: '54% Front / 46% Rear Dynamic', nismo: '54% Front / 46% Rear Dynamic' },
      { name: 'Body Construction', premium: 'Multi-Material (Steel, Aluminum, Carbon)', nismo: 'Dry Carbon Roof, Hood, Trunk, and Swan-Neck Wing' },
      { name: 'Exhaust System', premium: 'Quad Titanium Exhaust with Active Valves', nismo: 'Full Titanium NISMO Competition System' },
    ],
  },
];

export default function SpecsSection() {
  const [activeCategory, setActiveCategory] = useState(0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="specs-section" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
      {/* Subtle lighting */}
      <div className="absolute top-1/4 left-1/4 w-150 h-150 bg-[#0050FF]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/4 border border-white/10 text-[11px] font-mono tracking-widest uppercase text-[#00D6FF] mb-3">
            <Table className="w-3.5 h-3.5 text-[#00D6FF]" />
            TECHNICAL SPECIFICATIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Engineered to the <br />
            <span className="text-gradient-cyan">Tenth of a Millimeter.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-light">
            Comprehensive benchmark engineering data comparing the standard GT-R Premium against the track-focused GT-R NISMO.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {SPECS_DATA.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(idx)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
                activeCategory === idx
                  ? 'bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white shadow-[0_0_15px_rgba(0,214,255,0.3)]'
                  : 'glass-panel border-white/5 text-white/50 hover:text-white/80'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Apple-style Specs Table */}
        <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-white/3 p-4 sm:p-6 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-white/50">
            <div className="col-span-5 sm:col-span-4 text-white/80">SPECIFICATION PARAMETER</div>
            <div className="col-span-4 sm:col-span-4 text-center font-bold text-[#00D6FF]">
              GT-R PREMIUM
            </div>
            <div className="col-span-3 sm:col-span-4 text-center font-bold text-[#FF5E00]">
              GT-R NISMO
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {SPECS_DATA[activeCategory].items.map((item, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm hover:bg-white/2 transition-colors items-center"
              >
                <div className="col-span-5 sm:col-span-4 font-medium text-white/90">
                  {item.name}
                </div>
                <div className="col-span-4 sm:col-span-4 text-center text-white/70 font-mono text-xs sm:text-sm px-2">
                  {item.premium}
                </div>
                <div className="col-span-3 sm:col-span-4 text-center text-white font-mono text-xs sm:text-sm font-semibold px-2">
                  {item.nismo}
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer Actions */}
          <div className="p-4 sm:p-6 bg-white/2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00D6FF]" />
              <span>OFFICIAL FACTORY BENCH DATA • NISSAN MOTOR CO., LTD.</span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-white/10 text-white/80 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#00D6FF]" />
              <span>Print Technical Spec Sheet</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
