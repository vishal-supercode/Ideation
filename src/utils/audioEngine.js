// Web Audio API engine sound synthesizer for Nissan GT-R VR38DETT 3.8L Twin-Turbo V6
class GtrAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentRpm = 850; // Idle
    this.targetRpm = 850;
    this.isAccelerating = false;
    this.animId = null;

    // Audio nodes
    this.masterGain = null;
    this.subOsc = null;
    this.midOsc = null;
    this.highOsc = null;
    this.turboOsc = null;
    this.turboFilter = null;
    this.turboGain = null;
    this.exhaustFilter = null;
    this.distortionNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Distortion / saturation for V6 growl
    this.distortionNode = this.ctx.createWaveShaper();
    this.distortionNode.curve = this.makeDistortionCurve(18);
    this.distortionNode.oversample = '4x';
    this.distortionNode.connect(this.masterGain);

    // Exhaust low-pass filter
    this.exhaustFilter = this.ctx.createBiquadFilter();
    this.exhaustFilter.type = 'lowpass';
    this.exhaustFilter.frequency.setValueAtTime(600, this.ctx.currentTime);
    this.exhaustFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);
    this.exhaustFilter.connect(this.distortionNode);

    // V6 fundamental frequency oscillators (3 pairs firing)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sawtooth';
    this.subOsc.frequency.setValueAtTime(42.5, this.ctx.currentTime); // ~850 RPM / 20

    this.midOsc = this.ctx.createOscillator();
    this.midOsc.type = 'triangle';
    this.midOsc.frequency.setValueAtTime(85, this.ctx.currentTime);

    this.highOsc = this.ctx.createOscillator();
    this.highOsc.type = 'sawtooth';
    this.highOsc.frequency.setValueAtTime(127.5, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.subOsc.connect(subGain);
    subGain.connect(this.exhaustFilter);

    const midGain = this.ctx.createGain();
    midGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.midOsc.connect(midGain);
    midGain.connect(this.exhaustFilter);

    const highGain = this.ctx.createGain();
    highGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.highOsc.connect(highGain);
    highGain.connect(this.exhaustFilter);

    // Twin Turbocharger Spool Whistle
    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1400, this.ctx.currentTime);

    this.turboFilter = this.ctx.createBiquadFilter();
    this.turboFilter.type = 'bandpass';
    this.turboFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
    this.turboFilter.Q.setValueAtTime(12, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

    this.turboOsc.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);

    this.subOsc.start();
    this.midOsc.start();
    this.highOsc.start();
    this.turboOsc.start();

    this.startEngineLoop();
  }

  makeDistortionCurve(amount = 20) {
    const k = typeof amount === 'number' ? amount : 20;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  start() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.28, this.ctx.currentTime, 0.05);
    }
    this.isPlaying = true;
  }

  stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    }
    this.isPlaying = false;
  }

  throttleDown() {
    this.isAccelerating = true;
    this.targetRpm = 6800; // Peak power RPM
  }

  throttleUp() {
    this.isAccelerating = false;
    this.targetRpm = 850; // Idle
    this.triggerBlowOff();
  }

  triggerBlowOff() {
    if (!this.ctx || !this.isPlaying || this.currentRpm < 2500) return;
    try {
      // Noise buffer for turbo blow-off valve release "psssht"
      const bufferSize = this.ctx.sampleRate * 0.35;
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
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.35);
    } catch {
      // safe fallback
    }
  }

  setRpm(rpm) {
    this.targetRpm = Math.max(850, Math.min(7200, rpm));
  }

  startEngineLoop() {
    const loop = () => {
      // Smooth RPM transition
      const lerpSpeed = this.isAccelerating ? 0.07 : 0.04;
      this.currentRpm += (this.targetRpm - this.currentRpm) * lerpSpeed;

      if (this.ctx && this.subOsc) {
        const fundamental = this.currentRpm / 20; // V6 3 pulses per rev
        this.subOsc.frequency.setTargetAtTime(fundamental * 0.5, this.ctx.currentTime, 0.02);
        this.midOsc.frequency.setTargetAtTime(fundamental, this.ctx.currentTime, 0.02);
        this.highOsc.frequency.setTargetAtTime(fundamental * 2, this.ctx.currentTime, 0.02);

        // Exhaust filter opens with RPM
        const filterFreq = 400 + (this.currentRpm / 7200) * 2800;
        this.exhaustFilter.frequency.setTargetAtTime(filterFreq, this.ctx.currentTime, 0.03);

        // Turbo spool climbs with RPM
        const turboFreq = 1200 + (this.currentRpm / 7200) * 3600;
        this.turboOsc.frequency.setTargetAtTime(turboFreq, this.ctx.currentTime, 0.03);
        this.turboFilter.frequency.setTargetAtTime(turboFreq, this.ctx.currentTime, 0.03);

        const turboVolume = Math.max(0.005, (this.currentRpm - 1800) / 7200 * 0.12);
        this.turboGain.gain.setTargetAtTime(this.isPlaying ? turboVolume : 0, this.ctx.currentTime, 0.05);
      }

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  getRpm() {
    return Math.round(this.currentRpm);
  }
}

export const gtrAudio = new GtrAudioEngine();
