// Web Audio API engine sound engine for Nissan GT-R VR38DETT
// Powered by real audio recording of engine start, idle, and shutdown, plus authentic turbo blow-off flutter

class GtrAudioEngine {
  constructor() {
    this.ctx = null;
    this.audioBuffer = null;
    this.blowOffBuffer = null;
    this.isLoaded = false;
    this.isEngineRunning = false;
    this.isStarting = false;
    this.currentRpm = 0;
    this.targetRpm = 0;
    this.isAccelerating = false;
    this.throttlePressStartTime = 0;
    this.lastBlowOffTime = 0;
    this.animId = null;

    // Active audio nodes
    this.masterGain = null;
    this.startSourceNode = null;
    this.idleSourceNode = null;
    this.idleGainNode = null;
    this.stopSourceNode = null;
    this.blowOffSourceNode = null;

    // Turbo whistle & blowoff nodes
    this.turboOsc = null;
    this.turboFilter = null;
    this.turboGain = null;

    // Listeners for UI state changes
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial emit
    listener({
      isEngineRunning: this.isEngineRunning,
      isStarting: this.isStarting,
      rpm: Math.round(this.currentRpm),
    });
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener({
        isEngineRunning: this.isEngineRunning,
        isStarting: this.isStarting,
        rpm: Math.round(this.currentRpm),
      });
    }
  }

  async init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Turbocharger whistle oscillator for high RPM spool
    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.turboFilter = this.ctx.createBiquadFilter();
    this.turboFilter.type = 'bandpass';
    this.turboFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
    this.turboFilter.Q.setValueAtTime(10, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.turboOsc.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);
    this.turboOsc.start();

    this.startLoop();

    // Fetch and decode authentic GT-R audio files in parallel
    try {
      const [engineRes, flutterRes] = await Promise.all([
        fetch('/audio/engine-start.wav').catch(() => null),
        fetch('/audio/turbo-flutter.mp3').catch(() => null)
      ]);

      if (engineRes && engineRes.ok) {
        const engineBuf = await engineRes.arrayBuffer();
        this.audioBuffer = await this.ctx.decodeAudioData(engineBuf);
        this.isLoaded = true;
        console.log('GT-R engine audio buffer loaded. Duration:', this.audioBuffer.duration);
      }

      if (flutterRes && flutterRes.ok) {
        const flutterBuf = await flutterRes.arrayBuffer();
        this.blowOffBuffer = await this.ctx.decodeAudioData(flutterBuf);
        console.log('Turbo blow-off flutter audio buffer loaded. Duration:', this.blowOffBuffer.duration);
      }
    } catch (err) {
      console.warn('Error decoding engine audio:', err);
    }
  }

  async startEngine() {
    if (this.isEngineRunning || this.isStarting) return;
    this.isStarting = true;
    this.currentRpm = 180; // Starter cranking RPM
    this.targetRpm = 2200; // Peak startup catch flare
    this.notify();

    // Subtle tactile mobile vibration if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([25, 35, 30, 45, 60, 40, 90]); } catch {}
    }

    await this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // Stop any existing sources
    this.cleanupNodes();

    if (this.audioBuffer) {
      // 1. Play starting segment: from 0.0s to 2.4s (starter crank & ignition catch)
      const startNode = this.ctx.createBufferSource();
      startNode.buffer = this.audioBuffer;
      const startGain = this.ctx.createGain();
      startGain.gain.setValueAtTime(1.0, now);

      startNode.connect(startGain);
      startGain.connect(this.masterGain);

      startNode.start(now, 0, 2.4);
      this.startSourceNode = startNode;

      // 2. Schedule seamless transition to Idle loop at 2.25s
      setTimeout(() => {
        if (!this.isStarting && !this.isEngineRunning) return; // cancelled

        this.isStarting = false;
        this.isEngineRunning = true;
        this.targetRpm = 850; // Settle to 850 RPM idle
        this.notify();

        // Start looping idle segment: from 2.4s to 8.2s
        const idleNode = this.ctx.createBufferSource();
        idleNode.buffer = this.audioBuffer;
        idleNode.loop = true;
        idleNode.loopStart = 2.4;
        idleNode.loopEnd = 8.2;

        const idleGain = this.ctx.createGain();
        idleGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        idleGain.gain.linearRampToValueAtTime(0.9, this.ctx.currentTime + 0.15); // gentle crossfade

        idleNode.connect(idleGain);
        idleGain.connect(this.masterGain);

        idleNode.start(this.ctx.currentTime, 2.4);
        this.idleSourceNode = idleNode;
        this.idleGainNode = idleGain;
      }, 2250);

    } else {
      // Fallback
      setTimeout(() => {
        this.isStarting = false;
        this.isEngineRunning = true;
        this.targetRpm = 850;
        this.notify();
      }, 1000);
    }
  }

  stopEngine() {
    if (!this.isEngineRunning && !this.isStarting) return;
    this.isStarting = false;
    this.isEngineRunning = false;
    this.isAccelerating = false;
    this.targetRpm = 0;
    this.notify();

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([35, 50]); } catch {}
    }

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Fade out and stop the running idle loop
    if (this.idleGainNode && this.idleSourceNode) {
      try {
        this.idleGainNode.gain.cancelScheduledValues(now);
        this.idleGainNode.gain.setValueAtTime(this.idleGainNode.gain.value, now);
        this.idleGainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
        this.idleSourceNode.stop(now + 0.16);
      } catch {}
      this.idleSourceNode = null;
      this.idleGainNode = null;
    }

    if (this.startSourceNode) {
      try {
        this.startSourceNode.stop(now);
      } catch {}
      this.startSourceNode = null;
    }

    // Play the engine shutdown segment: from 8.35s to 9.9s (last 1.55s)
    if (this.audioBuffer) {
      try {
        const stopNode = this.ctx.createBufferSource();
        stopNode.buffer = this.audioBuffer;
        const stopGain = this.ctx.createGain();
        stopGain.gain.setValueAtTime(0.95, now);
        stopGain.gain.linearRampToValueAtTime(0.8, now + 1.2);
        stopGain.gain.linearRampToValueAtTime(0, now + 1.55);

        stopNode.connect(stopGain);
        stopGain.connect(this.masterGain);

        stopNode.start(now, 8.35, 1.55);
        this.stopSourceNode = stopNode;
      } catch (err) {
        console.warn('Error playing shutdown audio:', err);
      }
    }

    setTimeout(() => {
      this.currentRpm = 0;
      this.notify();
    }, 1200);
  }

  cleanupNodes() {
    if (this.startSourceNode) {
      try { this.startSourceNode.stop(); } catch {}
      this.startSourceNode = null;
    }
    if (this.idleSourceNode) {
      try { this.idleSourceNode.stop(); } catch {}
      this.idleSourceNode = null;
    }
    if (this.stopSourceNode) {
      try { this.stopSourceNode.stop(); } catch {}
      this.stopSourceNode = null;
    }
    if (this.blowOffSourceNode) {
      try { this.blowOffSourceNode.stop(); } catch {}
      this.blowOffSourceNode = null;
    }
  }

  toggleEngine() {
    if (this.isEngineRunning || this.isStarting) {
      this.stopEngine();
    } else {
      this.startEngine();
    }
  }

  throttleDown() {
    if (!this.isEngineRunning) return false;
    if (this.isAccelerating) return false; // Already accelerating
    this.isAccelerating = true;
    this.throttlePressStartTime = Date.now();
    this.targetRpm = 6800; // Redline rev
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([18]); } catch {}
    }
    return true;
  }

  throttleUp() {
    if (!this.isEngineRunning) return;
    if (!this.isAccelerating) return; // Prevent duplicate triggers from multiple mouse/touch events
    
    this.isAccelerating = false;
    this.targetRpm = 850; // Settle back to 850 RPM Idle
    
    const pressDuration = Date.now() - (this.throttlePressStartTime || 0);
    const reachedBoostRpm = this.currentRpm >= 3800;
    const now = Date.now();
    const cooldownPassed = (now - this.lastBlowOffTime) >= 1500;

    // Blow-off valve only triggers when held long enough into high boost RPM (>3800 RPM)
    // Small RPM blips and quick taps do not build boost pressure
    if (pressDuration >= 450 && reachedBoostRpm && cooldownPassed) {
      this.lastBlowOffTime = now;
      this.triggerBlowOff();
    }
  }

  // Authentic Turbo Blow-Off Valve / Flutter sound
  triggerBlowOff() {
    if (!this.ctx || !this.isEngineRunning) return;

    // Mobile haptic pulse for the blowoff flutter
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([25, 30, 20]); } catch {}
    }

    // 1. Play real uploaded turbo flutter audio file if available
    if (this.blowOffBuffer) {
      try {
        if (this.blowOffSourceNode) {
          try { this.blowOffSourceNode.stop(); } catch {}
          this.blowOffSourceNode = null;
        }

        const now = this.ctx.currentTime;
        const flutterSource = this.ctx.createBufferSource();
        flutterSource.buffer = this.blowOffBuffer;

        // Dynamic volume scaled by how high the engine revved into boost
        const boostVolume = Math.min(1.0, 0.6 + ((this.currentRpm - 3800) / 3000) * 0.4);
        const flutterGain = this.ctx.createGain();
        flutterGain.gain.setValueAtTime(boostVolume, now);

        flutterSource.connect(flutterGain);
        flutterGain.connect(this.masterGain);

        // Play the recorded turbo flutter sound immediately on throttle lift
        flutterSource.start(now, 0);
        this.blowOffSourceNode = flutterSource;
        return;
      } catch (err) {
        console.warn('Error playing blow-off flutter audio:', err);
      }
    }

    // 2. Synthesized fallback if buffer is not loaded
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  startLoop() {
    const loop = () => {
      // Smooth RPM interpolation
      const lerpSpeed = this.isAccelerating 
        ? 0.08 
        : (!this.isEngineRunning ? 0.07 : 0.04);
      
      this.currentRpm += (this.targetRpm - this.currentRpm) * lerpSpeed;
      if (Math.abs(this.currentRpm) < 8) this.currentRpm = 0;

      // Modulate audio playback rate with RPM so the recorded engine sound revs in real-time!
      if (this.idleSourceNode && this.isEngineRunning) {
        try {
          // At 850 RPM -> 1.0x rate. At 6800 RPM -> ~2.1x rate!
          const targetPlaybackRate = 1.0 + ((this.currentRpm - 850) / 5950) * 1.15;
          this.idleSourceNode.playbackRate.setTargetAtTime(
            Math.max(0.8, Math.min(2.5, targetPlaybackRate)), 
            this.ctx.currentTime, 
            0.05
          );
        } catch {}
      }

      // Turbo whistle frequency and gain modulation
      if (this.ctx && this.turboOsc && this.turboGain) {
        const turboFreq = 1200 + (this.currentRpm / 7200) * 3800;
        this.turboOsc.frequency.setTargetAtTime(turboFreq, this.ctx.currentTime, 0.03);
        this.turboFilter.frequency.setTargetAtTime(turboFreq, this.ctx.currentTime, 0.03);

        const turboVolume = this.isEngineRunning && this.currentRpm > 2000
          ? Math.min(0.12, ((this.currentRpm - 2000) / 5200) * 0.12)
          : 0;
        this.turboGain.gain.setTargetAtTime(turboVolume, this.ctx.currentTime, 0.05);
      }

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  getRpm() {
    return Math.round(this.currentRpm);
  }

  getRunningState() {
    return this.isEngineRunning;
  }
}

export const gtrAudio = new GtrAudioEngine();
