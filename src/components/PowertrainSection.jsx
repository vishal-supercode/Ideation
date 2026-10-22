import React, { useState } from 'react';
import { Gauge, Flame, Zap, Compass, RotateCw } from 'lucide-react';

export default function PowertrainSection() {
  const [sliderRpm, setSliderRpm] = useState(6800);

  // Dynamic calculations based on VR38DETT dyno curve
  // Peak torque: 467 lb-ft from 3300 to 5800 RPM
  // Peak power: 565 HP @ 6800 RPM
  const calculateOutput = (rpm) => {
    let torque;
    if (rpm < 2000) {
      torque = 250 + (rpm - 1000) * 0.15;
    } else if (rpm < 3300) {
      torque = 400 + ((rpm - 2000) / 1300) * 67;
    } else if (rpm <= 5800) {
      torque = 467; // Flat maximum torque plateau
    } else {
      torque = 467 - ((rpm - 5800) / 1400) * 45;
    }

    const hp = Math.round((torque * rpm) / 5252);
    const boost = rpm < 2500 ? (rpm / 2500) * 7.5 : 7.5 + ((rpm - 2500) / 4700) * 7.7;

    return {
      torque: Math.round(torque),
      hp: Math.min(565, Math.max(120, hp)),
      boost: boost.toFixed(1),
    };
  };

  const output = calculateOutput(sliderRpm);

  return (
    <section id="powertrain-section" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070709] text-white overflow-hidden border-t border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#FF5E00]/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-[#0050FF]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/4 border border-white/10 text-[11px] font-mono tracking-widest uppercase text-[#FF5E00] mb-3">
            <Flame className="w-3 h-3 text-[#FF5E00]" />
            VR38DETT TWIN-TURBO V6
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Unrelenting boost. <br />
            <span className="text-gradient-orange">Instantaneous throttle response.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-light">
            Two parallel turbochargers integrated directly into the exhaust manifolds minimize exhaust gas volume and eliminate lag. The result is explosive torque whenever you demand it.
          </p>
        </div>

        {/* Interactive Dyno & Telemetry Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Dyno Simulator */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-mono text-[#00D6FF] uppercase">REAL-TIME DYNO SIMULATOR</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Power & Torque Band</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-white/40">REDLINE</span>
                <div className="text-sm font-bold font-mono text-[#FF5E00]">7,100 RPM</div>
              </div>
            </div>

            {/* Interactive RPM Slider */}
            <div className="my-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-mono text-white/70 uppercase">DRAG ENGINE TACHOMETER</label>
                <span className="text-xl font-black font-mono text-[#00D6FF]">
                  {sliderRpm.toLocaleString()} <span className="text-xs text-white/50">RPM</span>
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="7100"
                step="50"
                value={sliderRpm}
                onChange={(e) => setSliderRpm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D6FF]"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/30 mt-2">
                <span>1,000 IDLE</span>
                <span>3,300 PEAK TORQUE</span>
                <span>6,800 PEAK POWER</span>
                <span>7,100 LIMIT</span>
              </div>
            </div>

            {/* Live Gauges Row */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {output.hp}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#00D6FF] font-mono mt-1">
                  HORSEPOWER (HP)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-[#FFA048] font-mono">
                  {output.torque}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono mt-1">
                  TORQUE (LB-FT)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-[#00D6FF] font-mono">
                  {output.boost}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono mt-1">
                  BOOST (PSI)
                </div>
              </div>
            </div>

            {/* Launch Control Card */}
            <div className="mt-6 p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between text-xs font-mono text-white/60">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5E00]" />
                <span>R-MODE LAUNCH CONTROL</span>
              </div>
              <span className="text-white font-bold">0-60 MPH IN 2.7 SECONDS</span>
            </div>
          </div>

          {/* Engine Architecture Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D6FF]">
                <Gauge className="w-4 h-4" />
                <span>PLASMA-COATED CYLINDERS</span>
              </div>
              <h4 className="text-base font-bold text-white">0.15mm Friction Elimination</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Rather than heavy cast-iron liners, a plasma torch deposits an ultra-thin 0.15mm layer on the cylinder walls, saving 6.6 lbs and dramatically enhancing heat transfer.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF5E00]">
                <Flame className="w-4 h-4" />
                <span>INTEGRATED TURBINE MANIFOLDS</span>
              </div>
              <h4 className="text-base font-bold text-white">Near-Zero Exhaust Distance</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                By casting the turbo housings directly into the exhaust manifolds, turbo spool time is reduced by 30%, guaranteeing instant power delivery upon corner exit.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D6FF]">
                <RotateCw className="w-4 h-4" />
                <span>DRY-SUMP STYLE LATERAL SCAVENGING</span>
              </div>
              <h4 className="text-base font-bold text-white">Sustained G-Force Lubrication</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                A magnesium oil pan with dual lateral scavenge pumps guarantees uninterrupted oil pressure even during 1.4G sustained track braking and high-speed cornering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}