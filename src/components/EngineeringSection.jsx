import React, { useState } from 'react';
import { Cpu, Shield, Wind, Disc, Award, ChevronRight, Check } from 'lucide-react';

const ENGINEERING_MODULES = [
  {
    id: 'takumi',
    icon: Award,
    category: 'POWERTRAIN',
    title: 'Takumi Handcrafted Assembly',
    subtitle: 'One Man, One Engine. Dust-free ISO Cleanroom Build.',
    summary: 'Only five master craftsmen—known in Japan as Takumi—are sanctioned to hand-assemble the VR38DETT engine. Each engine bears an aluminum plaque signed by its builder.',
    stats: [
      { label: 'Takumi Masters', value: '5 Worldwide' },
      { label: 'Assembly Room', value: 'ISO Class 5' },
      { label: 'Bench Dyno Test', value: '100% Tested' },
    ],
    details: [
      'Cylinder bores plasma-sprayed with a 0.15mm mirror finish to reduce friction and eliminate traditional heavy cast-iron liners.',
      'Connecting rods, crank journals, and piston crowns matched by weight within tenths of a gram for high-RPM vibration elimination.',
      'Every completed engine undergoes an exhaustive 44-minute bench test under simulated full load prior to vehicle chassis mating.',
    ],
  },
  {
    id: 'attesa',
    icon: Cpu,
    category: 'DRIVETRAIN',
    title: 'ATTESA E-TS All-Wheel Drive',
    subtitle: 'Independent Rear Transaxle Architecture',
    summary: 'The GT-R features the world’s first independent rear transaxle all-wheel drive platform. Twin carbon-composite propeller shafts transfer drive torque front and aft with millisecond precision.',
    stats: [
      { label: 'Rear Transaxle', value: 'GR6 Dual-Clutch' },
      { label: 'Torque Distribution', value: '0:100 to 50:50' },
      { label: 'Shift Speed', value: '150 ms' },
    ],
    details: [
      'Continuously monitors vehicle speed, lateral G, steering angle, and tire slip via dedicated high-frequency 3-axis sensors.',
      'Maintains 100% rear-wheel drive under typical cruising for high-speed steering purity and minimal drivetrain parasitic loss.',
      'Instantly channels up to 50% torque to front wheels within fractions of a millisecond the instant traction loss is computed.',
    ],
  },
  {
    id: 'chassis',
    icon: Shield,
    category: 'CHASSIS & DAMPING',
    title: 'Bilstein DampTronic® Suspension',
    subtitle: 'Multi-Rate Damping with Real-Time Chassis Tuning',
    summary: 'Constructed on a rigid Premium Midship (PM) platform combining carbon composite, die-cast aluminum, and high-tensile steel for maximum torsional rigidity.',
    stats: [
      { label: 'Suspension Modes', value: '3 (R / Normal / Comfort)' },
      { label: 'Front Calipers', value: '6-Piston Monoblock' },
      { label: 'Rotor Diameter', value: '390mm Front' },
    ],
    details: [
      'Bilstein DampTronic system recalculates shock damping forces every few milliseconds based on road surface input and G-force vectors.',
      'Brembo high-performance braking with full-floating two-piece diamond-pattern ventilated and cross-drilled rotors.',
      'Die-cast aluminum front shock towers uniball-mounted for laser-precise steering geometry preservation under high braking loads.',
    ],
  },
  {
    id: 'aero',
    icon: Wind,
    category: 'AERODYNAMICS',
    title: 'Cd 0.26 Slipstream Aerodynamics',
    subtitle: 'Engineered in the Wind Tunnel for Downforce Without Drag',
    summary: 'Every scoop, vent, and underbody contour directs cooling air to the brakes, coolers, and engine bay while creating balanced front-to-rear aerodynamic downforce.',
    stats: [
      { label: 'Drag Coefficient', value: 'Cd 0.26' },
      { label: 'Underbody Paneling', value: '100% Flat Carbon' },
      { label: 'Downforce Balance', value: '50% Front / 50% Rear' },
    ],
    details: [
      'Sculpted C-pillars suppress vortex turbulence behind the greenhouse, stabilizing airflow straight to the rear decklid spoiler.',
      'Carbon-fiber rear underbody diffuser channels high-velocity ground airflow to create suction downforce at speeds exceeding 150 mph.',
      'Dual hood NACA ducts channel high-pressure air directly to the twin turbocharger compressor inlets without increasing frontal drag.',
    ],
  },
];

export default function EngineeringSection() {
  const [activeTab, setActiveTab] = useState(ENGINEERING_MODULES[0].id);
  const activeModule = ENGINEERING_MODULES.find((m) => m.id === activeTab) || ENGINEERING_MODULES[0];

  return (
    <section id="engineering-section" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
      {/* Background Grid & Lighting */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-175 h-100 bg-[#0050FF]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/4 border border-white/10 text-[11px] font-mono tracking-widest uppercase text-[#00D6FF] mb-3">
            TECHNICAL DEEP DIVE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Obsessive engineering. <br className="hidden sm:inline" />
            <span className="text-gradient-cyan">Uncompromising execution.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-light">
            Every component in the Nissan GT-R exists for one singular purpose: to deliver benchmark performance, track endurance, and tactile communication to the driver.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {ENGINEERING_MODULES.map((item) => {
            const isSelected = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 relative border ${
                  isSelected
                    ? 'glass-panel border-[#00D6FF]/50 shadow-[0_0_20px_rgba(0,214,255,0.15)] bg-linear-to-b from-white/8 to-white/2'
                    : 'bg-white/2 border-white/5 hover:border-white/15 hover:bg-white/4'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#00D6FF]/20 text-[#00D6FF]' : 'bg-white/5 text-white/50'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    {item.category}
                  </span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">{item.title}</div>
                {isSelected && (
                  <div className="absolute -bottom-px left-6 right-6 h-0.5 bg-linear-to-r from-transparent via-[#00D6FF] to-transparent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Module Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono text-[#00D6FF] tracking-wider uppercase">
                  {activeModule.category} SPECIFICATION
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  {activeModule.title}
                </h3>
                <p className="text-base text-[#FFA048] font-medium mt-1">
                  {activeModule.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                {activeModule.summary}
              </p>

              {/* Bullet details */}
              <div className="space-y-3 pt-2">
                {activeModule.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-[#0050FF]/20 text-[#00D6FF] mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-white/75 leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Telemetry Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-5">
                <div className="text-xs font-mono uppercase text-white/40 tracking-wider flex items-center justify-between">
                  <span>SYSTEM METRICS</span>
                  <span className="text-[#00D6FF]">VERIFIED BENCH</span>
                </div>

                <div className="space-y-4">
                  {activeModule.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                      <span className="text-xs text-white/60">{stat.label}</span>
                      <span className="text-sm sm:text-base font-bold text-white font-mono">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-white/40 font-mono flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D6FF] animate-pulse" />
                  NISSAN MOTORSPORT HERITAGE SPECIFICATION
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
