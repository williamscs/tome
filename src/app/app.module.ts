import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { CharacterComponent } from './character/character.component';
import { DriveComponent } from './drive/drive.component';
import { DriveService } from './drive/drive.service';


@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    DriveComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [ DriveService, {provide: 'Window', useValue: window}],
  bootstrap: [AppComponent]
})
export class AppModule { }
