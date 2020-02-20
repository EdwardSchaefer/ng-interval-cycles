import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material';
import { MatrixComponent } from './matrix/matrix.component';
import { WaveformComponent } from './waveform/waveform.component';
import { CircleComponent } from './circle/circle.component';

@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    WaveformComponent,
    CircleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
