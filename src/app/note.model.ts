import {Interval} from './interval-model';
import {BehaviorSubject, Subject} from 'rxjs';

export class Note {
  osc: OscillatorNode;
  gain: GainNode;
  interval: Interval;
  context: any;
  startTime: number;
  released: boolean;
  sustained: boolean;
  releaseCurve: number[];
  key: string;
  noteAnalyser;
  stopped: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  stoppedBoolean: boolean;
  opacity: number;
  xPosition: number;
  xOffset = 10;
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
    this.draw();
  }
  play(curve: number[][]) {
    const preSustainCurve = [...curve[0], ...curve[1]];
    this.releaseCurve = curve[2];
    this.osc.start();
    this.startTime = this.context.currentTime;
    this.setCurve(preSustainCurve);
    setTimeout(() => {
      this.sustained = true;
      if (this.released) {
        this.sustained = false;
        this.setCurve(this.releaseCurve);
        setTimeout(() => this.stop(), this.releaseCurve.length);
      }
    }, preSustainCurve.length);
  }
  setCurve(curve: number[]) {
    let contextTime = this.context.currentTime;
    curve.forEach(gainValue => {
      this.gain.gain.setValueAtTime(gainValue, contextTime);
      contextTime = contextTime + 0.001;
    });
  }
  releaseNote() {
    this.released = true;
    if (this.sustained) {
      this.xOffset = this.xOffset + 400;
      this.startTime = this.context.currentTime;
      this.sustained = false;
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
    this.stoppedBoolean = true;
  }
  draw() {
    if (!this.stoppedBoolean) {
      const timesReducer = (acc, curr) => Math.abs(curr - 128) > acc ? Math.abs(curr - 128) : acc;
      const times = new Uint8Array(this.noteAnalyser.frequencyBinCount);
      this.noteAnalyser.getByteTimeDomainData(times);
      this.opacity = times.reduce(timesReducer, 0) / 128;
      if (!this.sustained) {
        this.xPosition = -1000 * (this.startTime - this.context.currentTime) + this.xOffset;
      } else {
        this.xPosition = this.xOffset + 400;
      }
      requestAnimationFrame(this.draw.bind(this));
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
