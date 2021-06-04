import {Injectable} from '@angular/core';
import {SynthService} from './synth.service';
import {BehaviorSubject, from, Observable, of, Subject} from 'rxjs';
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
  midiUp: Observable<any> = from(this.subject).pipe(filter(midi => midi.data[0] === 128), map(midi => midi.data[1]));
  midiDown: Observable<any> = from(this.subject).pipe(filter(midi => midi.data[0] === 144), map(midi => midi.data[1]));
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
            // console.log(change);
            if (change.port.type === 'input' && change.port.connection === 'closed') {
              this.mapMIDI(change.target.inputs);
            }
          };
        }
      });
    }
    this.subject.subscribe(a => {
      // console.log(a.data);
      // if (a.data[0] === 144) {
        // console.log('sub', a.data);
      // }
    });
  }
  mapMIDI(inputs) {
    inputs.forEach(input => {
      this.midiInput = input;
      this.midiInput.onmidimessage = message => this.onMidiMessage(message);
      this.midiLoaded.next(true);
    });
  }
  onMidiMessage(message) {
    if (this.midiMap.length < 2) {
      this.midiMap.push(message.data[0]);
    } else {
      // this.subject.next(message);
    }
  }
}
