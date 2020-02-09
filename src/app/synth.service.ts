import { Injectable } from '@angular/core';
import { SourceNode } from './source-node-model';
import {Interval} from './interval-model';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  sourceNodes: SourceNode[];
  constructor() {}
  initialize() {
    this.context = new AudioContext();
    this.initialized = true;
  }
  addSourceNodes(temperament: number) {
    this.sourceNodes = [];
    for (let i = 0; i < temperament; i++) {
      this.sourceNodes.push(new SourceNode(temperament, i));
    }
  }
  play(interval: Interval) {
    if (!this.initialized) {
      this.initialize();
    }
    this.sourceNodes[interval.value].play(this.context);
  }
  stop(interval: Interval) {
    if (this.initialized) {
      this.sourceNodes[interval.value].stop();
    }
  }
}
