import {Injectable} from '@angular/core';
import {SynthService} from './synth.service';
import {BehaviorSubject, from, Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MidiService {
  inputs;
  midiInput;
  subject: Subject<any> = new Subject<any>();
  midiUp: Observable<any> = from(this.subject).pipe(filter(midi => midi.data[0] === 128), map(midi => midi.data[1]));
  midiDown: Observable<any> = from(this.subject).pipe(filter(midi => midi.data[0] === 144), map(midi => midi.data[1]));
  midiLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(public synth: SynthService) {
    const nav: any = navigator;
    if (nav.requestMIDIAccess) {
      nav.requestMIDIAccess().then(access => {
        this.inputs = access.inputs;
        this.inputs.forEach(input => {
          this.midiInput = input;
          this.midiInput.onmidimessage = message => this.subject.next(message);
          this.midiLoaded.next(true);
        });
      });
    }
  }
}
