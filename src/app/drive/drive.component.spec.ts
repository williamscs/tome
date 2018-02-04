import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveComponent } from './drive.component';
import { Subject } from 'rxjs/Subject';
import { DriveService } from './drive.service';

class MockDriveService {
  private statusUpdatedSource = new Subject<boolean>();
  statusUpdated$ = this.statusUpdatedSource.asObservable();

  constructor() {
  }

  initClient() {
    this.updateSigninStatus(this.isSignedIn());
  }

  updateSigninStatus(status: boolean) {
    this.statusUpdatedSource.next(status);
  }

  isSignedIn(): boolean {
    return true;
  }

  async retrieveSaveData() {

    return {};
  }

  async getFileId() {
    return '1234';
  }

  async saveFile(metadata, content) {
      return null;
  }

  async signIn() {
    this.updateSigninStatus(true);
  }

  async signOut() {

    // Clear client data that we currently have.
    // this.gapi.client = undefined;
    this.updateSigninStatus(false);
  }
}

describe('DriveComponent', () => {
  let component: DriveComponent;
  let fixture: ComponentFixture<DriveComponent>;

  beforeEach(async(() => {
    const mockDriveService = new MockDriveService();
    TestBed.configureTestingModule({
      declarations: [ DriveComponent ],
      providers: [{provide: DriveService, useValue: mockDriveService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
