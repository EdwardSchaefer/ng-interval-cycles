import {Injectable} from '@angular/core';
import {SynthService} from './synth.service';
import {BehaviorSubject, from, Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MidiService {
  navRef: any = navigator;
  MIDIAccess;
  inputs;
  midiInput;
  subject: Subject<any> = new Subject<any>();
  midiUp: Observable<any>;
  midiDown: Observable<any>;
  midiMap: number[] = [];
  midiLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(public synth: SynthService) {
    if (this.navRef.requestMIDIAccess) {
      this.navRef.requestMIDIAccess().then(access => {
        this.MIDIAccess = access;
        if (this.MIDIAccess.inputs.size) {
          this.mapMIDI(this.MIDIAccess.inputs);
        } else {
          this.MIDIAccess.onstatechange = change => {
            if (change.port.type === 'input' && change.port.connection === 'closed') {
              this.mapMIDI(change.target.inputs);
            }
          };
        }
      });
    }
    this.subject.subscribe(a => console.log(a));
  }
  mapMIDI(inputs) {
    inputs.forEach(input => {
      this.midiInput = input;
      this.midiInput.onmidimessage = message => this.midiMap.length < 2 ? this.initMidi(message) : this.subject.next(message.data);
    });
  }
  initMidi(message) {
    this.midiMap.push(message.data);
    let upfilter;
    let downfilter;
    if (this.midiMap.length === 2) {
      upfilter = this.midiMap[1][2] === 0 ? midiManUpFilter : akaiUpFilter;
      downfilter = this.midiMap[1][2] === 0 ? midiManDownFilter : akaiDownFilter;
    }
    this.midiUp = from(this.subject).pipe(filter(upfilter), map(midi => midi[1]));
    this.midiDown = from(this.subject).pipe(filter(downfilter), map(midi => midi[1]));
    if (this.midiMap.length === 2) {
      this.midiLoaded.next(true);
    }
  }
}

const midiManUpFilter = (data: number[]) => (data[0] === 159 && !data[2]);
const midiManDownFilter = (data: number[]) => (data[0] === 159 && !!data[2]);
const akaiUpFilter = (data: number[]) => (data[0] === 128);
const akaiDownFilter = (data: number[]) => (data[0] === 144);
