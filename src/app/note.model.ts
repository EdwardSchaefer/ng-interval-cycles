import {Interval} from './interval-model';

export class Note {
  osc: OscillatorNode;
  gain: GainNode;
  interval: Interval;
  context: any;
  released: boolean;
  sustained: boolean;
  releaseCurve: number[];
  key: string;
  constructor(noteData: NoteInterface) {
    this.interval = noteData.interval;
    this.osc = noteData.osc;
    this.gain = noteData.gain;
    this.context = noteData.context;
    this.osc.type = 'sine';
    this.osc.frequency.value = this.interval.frequency;
    this.gain.gain.value = 0.5;
    this.osc.connect(this.gain);
    this.play(noteData.curve);
  }
  play(curve: number[][]) {
    const preSustainCurve = [...curve[0], ...curve[1]];
    this.releaseCurve = curve[2];
    this.osc.start();
    this.setCurve(preSustainCurve);
    setTimeout(() => {
      this.sustained = true;
      if (this.released) {
        this.setCurve(this.releaseCurve);
        setTimeout(() => this.stop(), this.releaseCurve.length);
      }
    }, preSustainCurve.length);
  }
  stop() {
    this.gain.disconnect();
    this.osc.disconnect();
    this.osc.stop();
  }
  setCurve(curve: number[]) {
    let contextTime = this.context.currentTime;
    let curveTime = 0;
    curve.forEach(gainValue => {
      this.gain.gain.setValueAtTime(gainValue, contextTime);
      curveTime = curveTime + 1;
      contextTime = contextTime + 0.001;
    });
  }
  releaseNote() {
    this.released = true;
    if (this.sustained) {
      this.setCurve(this.releaseCurve);
      setTimeout(() => this.stop(), this.releaseCurve.length);
    }
  }
}

export interface NoteInterface {
  osc: OscillatorNode;
  gain: GainNode;
  interval: Interval;
  curve: number[][];
  context: any;
}
