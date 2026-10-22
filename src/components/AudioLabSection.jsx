import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Zap, Gauge, Play, Pause, Radio } from 'lucide-react';
import { gtrAudio } from '../utils/audioEngine';

export default function AudioLabSection({ soundEnabled, setSoundEnabled }) {
  const [rpm, setRpm] = useState(850);
  const [isPressingThrottle, setIsPressingThrottle] = useState(false);
  const [boostPsi, setBoostPsi] = useState(0.2);
  const animRef = useRef(null);

  // Sync state with audio engine loop
  useEffect(() => {
    const updateLoop = () => {
      const currentRpm = gtrAudio.getRpm();
      setRpm(currentRpm);

      // Boost calculation
      const calculatedBoost = currentRpm < 2000 
        ? 0.2 + (currentRpm / 2000) * 1.5 
        : 1.7 + ((currentRpm - 2000) / 4800) * 13.5;
      setBoostPsi(parseFloat(calculatedBoost.toFixed(1)));

      animRef.current = requestAnimationFrame(updateLoop);
    };

    animRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleStartRev = () => {
    if (!soundEnabled) {
      gtrAudio.start();
      setSoundEnabled(true);
    }
    setIsPressingThrottle(true);
    gtrAudio.throttleDown();
  };

  const handleStopRev = () => {
    setIsPressingThrottle(false);
    gtrAudio.throttleUp();
  };

  const toggleMasterSound = () => {
    if (soundEnabled) {
      gtrAudio.stop();
      setSoundEnabled(false);
    } else {
      gtrAudio.start();
      setSoundEnabled(true);
    }
  };

  // Tachometer needle angle: 0 RPM = -120deg, 7500 RPM = +120deg
  const needleAngle = -120 + (rpm / 7500) * 240;

  return (
    <section id="audio-section" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
      {/* Background Lighting */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#FF5E00]/10 blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            The Sound of <br />
            <span className="text-gradient-orange">Pure Combustion.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-light">
            Interactive real-time audio synthesizer reproducing the twin-turbo whistle, combustion resonance, and titanium quad exhaust pulse of the GT-R VR38DETT.
          </p>
        </div>

        {/* Cockpit Gauge Cluster & Throttle Console */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Tachometer Instrument Gauge */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-4">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-black/80 border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
                {/* Radial Glow */}
                <div className={`absolute inset-4 rounded-full transition-opacity duration-300 ${isPressingThrottle ? 'bg-[#FF5E00]/15' : 'bg-transparent'}`} />

                {/* Gauge Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {/* Background Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="82"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    strokeDasharray="386"
                    strokeDashoffset="128"
                  />
                  {/* Dynamic RPM Arc */}
                  <circle
                    cx="100"
                    cy="100"
                    r="82"
                    fill="none"
                    stroke={rpm > 6500 ? '#FF2200' : '#FF5E00'}
                    strokeWidth="8"
                    strokeDasharray="386"
                    strokeDashoffset={386 - ((rpm / 7500) * 258)}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Ticks markings */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const angle = -120 + (num / 7) * 240;
                  const rad = (angle * Math.PI) / 180;
                  const x = 100 + 64 * Math.sin(rad);
                  const y = 100 - 64 * Math.cos(rad);
                  return (
                    <div
                      key={num}
                      className="absolute text-[11px] font-mono font-bold"
                      style={{
                        left: `${(x / 200) * 100}%`,
                        top: `${(y / 200) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        color: num >= 7 ? '#FF2200' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {num}
                    </div>
                  );
                })}

                {/* Needle */}
                <div
                  className="absolute w-1.5 h-28 bg-linear-to-t from-transparent via-[#FF5E00] to-white rounded-full origin-bottom pointer-events-none transition-transform duration-75 shadow-[0_0_12px_#FF5E00]"
                  style={{
                    bottom: '50%',
                    transform: `rotate(${needleAngle}deg)`,
                  }}
                />

                {/* Center Cap */}
                <div className="relative z-10 w-28 h-28 rounded-full bg-[#0a0a0d] border border-white/20 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-[10px] font-mono uppercase text-[#00D6FF] tracking-wider">RPM</span>
                  <div className="text-2xl font-black font-mono text-white tracking-tight">
                    {rpm}
                  </div>
                  <span className="text-[9px] font-mono text-white/40">x1000 r/min</span>
                </div>
              </div>

              {/* Lower Cluster Info */}
              <div className="flex items-center gap-6 mt-6 text-xs font-mono">
                <div className="text-center">
                  <div className="text-white/40 text-[10px]">BOOST</div>
                  <div className="font-bold text-[#00D6FF]">{boostPsi} PSI</div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-white/40 text-[10px]">GEAR</div>
                  <div className="font-bold text-white">N</div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-white/40 text-[10px]">OIL TEMP</div>
                  <div className="font-bold text-[#FFA048]">92°C</div>
                </div>
              </div>
            </div>

            {/* Right Controls & Interactive Rev Pedal */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 text-center">
              <div>
                <span className="text-xs font-mono text-[#00D6FF] tracking-wider uppercase">
                  INTERACTIVE THROTTLE ACTUATOR
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Experience the Twin-Turbo Spool
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mt-2 font-light">
                  Press and hold the throttle to spin the turbos and open the exhaust bypass. Release to hear the blow-off valve divert compressed air.
                </p>
              </div>

              {/* The Throttle Pedal Button */}
              <div className="w-full max-w-xs">
                <button
                  onMouseDown={handleStartRev}
                  onMouseUp={handleStopRev}
                  onMouseLeave={handleStopRev}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleStartRev();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleStopRev();
                  }}
                  className={`w-full py-6 px-8 rounded-2xl font-black font-mono text-base tracking-wider uppercase transition-all duration-200 select-none shadow-2xl relative overflow-hidden ${
                    isPressingThrottle
                      ? 'bg-linear-to-r from-[#FF2200] to-[#FF5E00] text-white scale-95 shadow-[0_0_40px_rgba(255,94,0,0.6)]'
                      : 'bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white hover:scale-[1.02] shadow-[0_0_25px_rgba(0,214,255,0.3)]'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Flame className={`w-5 h-5 ${isPressingThrottle ? 'animate-bounce' : ''}`} />
                    {isPressingThrottle ? 'THROTTLE WIDE OPEN!' : 'HOLD TO REV (WOT)'}
                  </span>
                </button>
                <div className="text-[10px] font-mono text-white/40 mt-2">
                  (PRESS & HOLD TO ACCELERATE • RELEASE FOR BLOW-OFF)
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={toggleMasterSound}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-medium text-white/80 hover:text-white hover:border-[#00D6FF]/40 transition-colors"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#00D6FF]" />
                      <span>Audio Active (Click to Mute)</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-white/40" />
                      <span>Audio Muted (Click to Enable)</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
