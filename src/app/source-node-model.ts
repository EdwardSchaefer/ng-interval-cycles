export class SourceNode {
  osc: OscillatorNode;
  gain: GainNode;
  temperament: number;
  interval: number;
  frequency: number;
  referencePitchHz = 440;
  constructor(temperament: number, interval: number) {
    this.interval = interval;
    this.temperament = temperament;
    const equalTempNthRootOfTwo = Math.pow(2, (1 / this.temperament));
    const productQ = Math.pow(equalTempNthRootOfTwo, this.interval);
    this.frequency = (this.referencePitchHz * productQ);
  }
  play(context) {
    this.osc = context.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.value = this.frequency;
    this.gain = context.createGain();
    this.gain.connect(context.destination);
    this.gain.gain.value = 100;
    this.osc.connect(this.gain);
    this.osc.start();
  }
  stop() {
    if (this.gain && this.osc) {
      this.gain.disconnect();
      this.osc.stop();
      this.osc.disconnect();
    }
  }
}
