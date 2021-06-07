# NgIntervalCycles

## Introduction

NgIntervalCycles is a web application used to explore equal temperaments in the context of music. It uses the browser's AudioContext as a synthesiser and allows for MIDI inputs.

## Deployment

https://edwardschaefer.github.io/ng-interval-cycles/

# Components

## MatrixComponent

![MatrixComponent](/src/assets/matrix.jpg?raw=true)

The MatrixComponent displays the matrix of intervals generated by the selected temperament. Clicking a cell will play the selected note, and holding click will sustain the note. Selecting 'key' mode will show the keyboard key which can be pressed (and held) to play/sustain the note.

## CircleComponent

![CircleComponent](/src/assets/circle.jpg?raw=true)

The CircleComponent shows the relationship between the played notes in a radial pattern. It is similar to the circle of fifths (chord mode) or chromatic circle (radius mode) diagram.

## WaveformComponent

![WaveformComponent](/src/assets/waveform.jpg?raw=true)

The WaveformComponent shows the output of all the notes currently being played. Notice the interference between different notes, the amplitude in respect to volume, and the shape of the waveform selected ('sine', 'square', 'sawtooth', 'triangle').

## EnvelopeComponent

![EnvelopeComponent](/src/assets/envelope.jpg?raw=true)

The EnvelopeComponent allows for manipulation of how each note is played over time in an 'attack', 'decay', 'sustain', 'release' pattern. Click and drag the handles to change the contour of the envelope.


# Angular CLI Information

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
