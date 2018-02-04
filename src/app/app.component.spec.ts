import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {CharacterComponent} from './character/character.component';
import {DriveComponent} from './drive/drive.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';


@Component({
  selector: 'app-drive',
  template: ''
})
export class MockDriveComponent {
}
@Component({
  selector: 'app-character',
  template: ''
})
export class MockCharacterComponent {
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockCharacterComponent,
        MockDriveComponent
      ],
      imports: [
        // BrowserModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Tome'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Tome');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Tome');
  }));
});
