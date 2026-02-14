
/**
 * Motor de som sintético usando Web Audio API para evitar arquivos externos
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playNotify() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx!.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx!.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.2);
  }

  playSuccess() {
    this.init();
    const playTone = (freq: number, start: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + start);
      gain.gain.setValueAtTime(0.1, this.ctx!.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + start + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + start);
      osc.stop(this.ctx!.currentTime + start + 0.3);
    };
    playTone(523.25, 0); // C5
    playTone(659.25, 0.1); // E5
    playTone(783.99, 0.2); // G5
  }

  playAlert() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx!.currentTime);
    osc.frequency.linearRampToValueAtTime(220, this.ctx!.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.3);
  }
}

export const soundEngine = new SoundEngine();
