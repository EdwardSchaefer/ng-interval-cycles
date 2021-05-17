import {Interval} from './interval-model';
import {BehaviorSubject} from "rxjs";

export class Note {
  osc: OscillatorNode;
  gain: GainNode;
  interval: Interval;
  context: any;
  released: boolean;
  sustained: boolean;
  releaseCurve: number[];
  key: string;
  noteAnalyser;
  stopped: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(noteData: NoteInterface) {
    this.interval = noteData.interval;
    this.osc = noteData.osc;
    this.gain = noteData.gain;
    this.context = noteData.context;
    this.osc.type = 'sine';
    this.osc.frequency.value = this.interval.frequency;
    this.gain.gain.value = 0.5;
    this.osc.connect(this.gain);
    this.noteAnalyser = this.context.createAnalyser();
    this.gain.connect(this.noteAnalyser);
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
  stop() {
    this.gain.disconnect();
    this.noteAnalyser.disconnect();
    this.osc.stop();
    this.osc.disconnect();
    this.stopped.next(true);
  }
}

export interface NoteInterface {
  osc: OscillatorNode;
  gain: GainNode;
  interval: Interval;
  curve: number[][];
  context: any;
}
