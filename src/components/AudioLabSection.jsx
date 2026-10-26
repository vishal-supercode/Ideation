import { useState, useEffect, useRef } from 'react';
import { Flame, ShieldAlert} from 'lucide-react';
import { gtrAudio } from '../utils/audioEngine';

export default function AudioLabSection({ setSoundEnabled }) {
  const [rpm, setRpm] = useState(0);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPressingThrottle, setIsPressingThrottle] = useState(false);
  const [boostPsi, setBoostPsi] = useState(0.0);
  const [warningFlash, setWarningFlash] = useState(false);
  
  const animRef = useRef(null);
  const isPressingThrottleRef = useRef(false);

  // Subscribe to audio engine state
  useEffect(() => {
    const unsubscribe = gtrAudio.subscribe((state) => {
      setIsEngineRunning(state.isEngineRunning);
      setIsStarting(state.isStarting);
      if (setSoundEnabled) {
        setSoundEnabled(state.isEngineRunning || state.isStarting);
      }
    });
    return unsubscribe;
  }, [setSoundEnabled]);

  // Sync RPM and boost in animation loop
  useEffect(() => {
    const updateLoop = () => {
      const currentRpm = gtrAudio.getRpm();
      setRpm(currentRpm);

      // Boost calculation (only positive boost when revving)
      if (currentRpm > 1800) {
        const calculatedBoost = 0.5 + ((currentRpm - 1800) / 5000) * 14.7;
        setBoostPsi(parseFloat(calculatedBoost.toFixed(1)));
      } else if (currentRpm > 0) {
        setBoostPsi(0.2);
      } else {
        setBoostPsi(0.0);
      }

      animRef.current = requestAnimationFrame(updateLoop);
    };

    animRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleStartStopClick = () => {
    gtrAudio.toggleEngine();
  };

  const handleStartRev = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (!isEngineRunning) {
      setWarningFlash(true);
      setTimeout(() => setWarningFlash(false), 1200);
      return;
    }
    if (isPressingThrottleRef.current) return;
    isPressingThrottleRef.current = true;
    setIsPressingThrottle(true);
    gtrAudio.throttleDown();
  };

  const handleStopRev = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (!isPressingThrottleRef.current) return;
    isPressingThrottleRef.current = false;
    setIsPressingThrottle(false);
    gtrAudio.throttleUp();
  };

  // Tachometer needle angle: 0 RPM = -120deg, 7500 RPM = +120deg
  const needleAngle = -120 + (rpm / 7500) * 240;

  return (
    <section
      id="audio-section"
      className="relative -mt-0.5 py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(5, 5, 5, 0.38), rgba(5, 5, 5, 0.62)), url('/Neon%20Sunset%20Boulevard%20by%20the%20Bay.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 35%',
      }}
    >
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
            Push the engine start button to hear the starter crank and 3.8L twin-turbo V6 catch fire, or hold the throttle to spool up the boost.
          </p>
        </div>

        {/* Cockpit Gauge Cluster & Throttle Console */}
        <div className="glass-panel p-6 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Tachometer Instrument Gauge */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 sm:p-4">
              <div className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-black/80 border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform ${
                isStarting 
                  ? 'engine-vibrate-startup' 
                  : isPressingThrottle 
                  ? 'engine-vibrate-rev' 
                  : (isEngineRunning ? 'engine-vibrate-idle' : '')
              }`}>
                {/* Radial Glow */}
                <div className={`absolute inset-4 rounded-full transition-opacity duration-300 ${
                  isPressingThrottle ? 'bg-[#FF5E00]/20' : (isEngineRunning ? 'bg-[#00D6FF]/5' : 'bg-transparent')
                }`} />

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
                        color: num >= 7 ? '#FF2200' : (isEngineRunning ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'),
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
                  <span className="text-[9px] font-mono text-white/40">
                    {isEngineRunning ? 'IDLE: 850' : 'OFF: 0'}
                  </span>
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
                  <div className="text-white/40 text-[10px]">IGNITION</div>
                  <div className={`font-bold ${isEngineRunning ? 'text-green-400' : isStarting ? 'text-amber-400' : 'text-white/40'}`}>
                    {isStarting ? 'CRANKING' : (isEngineRunning ? 'ON' : 'OFF')}
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-white/40 text-[10px]">STATUS</div>
                  <div className="font-bold text-[#FFA048]">
                    {isEngineRunning ? 'READY' : 'STANDBY'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Controls: Start/Stop Button & Rev Pedal */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 text-center">
              <div>
                <span className="text-xs font-mono text-[#00D6FF] tracking-wider uppercase">
                  NISSAN GT-R COCKPIT CONTROLS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Engine Ignition & Throttle
                </h3>
              </div>

              {/* AUTHENTIC GT-R RED ALUMINUM START/STOP BUTTON */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleStartStopClick}
                  className={`relative group flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 transition-all duration-300 shadow-2xl active:scale-95 ${
                    isEngineRunning
                      ? 'bg-linear-to-b from-[#e01a00] to-[#800b00] border-[#ff4d36] shadow-[0_0_35px_rgba(255,50,20,0.7)] scale-102'
                      : isStarting
                      ? 'bg-linear-to-b from-[#ff8c00] to-[#b35900] border-[#ffa64d] shadow-[0_0_30px_rgba(255,140,0,0.6)] animate-pulse'
                      : 'bg-linear-to-b from-[#2a2c35] to-[#121318] border-white/20 hover:border-red-500/80 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:scale-105'
                  }`}
                  title={isEngineRunning ? "Click to Stop Engine" : "Click to Start Engine"}
                >
                  {/* Metallic Bevel Ring */}
                  <div className="absolute inset-1 rounded-full border border-white/15 pointer-events-none" />
                  
                  {/* Status Indicator LED */}
                  <div className={`w-2 h-2 rounded-full mb-1 transition-colors duration-300 ${
                    isEngineRunning ? 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]' :
                    isStarting ? 'bg-[#ffaa00] animate-ping' :
                    'bg-red-500/40'
                  }`} />

                  <span className="text-[9px] font-mono font-bold tracking-widest text-white/70 uppercase">
                    ENGINE
                  </span>
                  <span className="text-xs font-black font-mono tracking-tight text-white uppercase">
                    {isStarting ? 'CRANKING' : (isEngineRunning ? 'STOP' : 'START')}
                  </span>
                </button>
              </div>

              {/* Warning if trying to rev while engine is off */}
              {warningFlash && (
                <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2 animate-bounce">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Start the engine first using the START button!</span>
                </div>
              )}

              {/* The Throttle Pedal Button */}
              <div className="w-full max-w-xs">
                <button
                  onPointerDown={(e) => {
                    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
                    handleStartRev(e);
                  }}
                  onPointerUp={(e) => {
                    handleStopRev(e);
                  }}
                  onPointerCancel={(e) => {
                    handleStopRev(e);
                  }}
                  className={`w-full py-5 px-6 rounded-2xl font-black font-mono text-sm tracking-wider uppercase transition-all duration-200 select-none shadow-2xl relative overflow-hidden touch-none ${
                    !isEngineRunning
                      ? 'bg-white/4 border border-white/10 text-white/40 hover:border-red-500/50 hover:text-white/70'
                      : isPressingThrottle
                      ? 'bg-linear-to-r from-[#FF2200] to-[#FF5E00] text-white scale-95 shadow-[0_0_40px_rgba(255,94,0,0.6)]'
                      : 'bg-linear-to-r from-[#0050FF] to-[#00D6FF] text-white hover:scale-[1.02] shadow-[0_0_25px_rgba(0,214,255,0.3)]'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Flame className={`w-4 h-4 ${isPressingThrottle ? 'animate-bounce text-white' : (isEngineRunning ? 'text-[#FF5E00]' : 'text-white/20')}`} />
                    {!isEngineRunning 
                      ? 'ENGINE OFF (START FIRST)' 
                      : (isPressingThrottle ? 'THROTTLE WIDE OPEN!' : 'HOLD TO REV (WOT)')}
                  </span>
                </button>
                <div className="text-[10px] font-mono text-white/40 mt-2">
                  {isEngineRunning 
                    ? '(HOLD TO BUILD BOOST >3,800 RPM . RELEASE FOR BLOW-OFF)' 
                    : '(START THE ENGINE ABOVE TO UNLOCK THROTTLE)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
