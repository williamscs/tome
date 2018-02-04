import { TestBed, inject } from '@angular/core/testing';

import { DriveService } from './drive.service';

describe('DriveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriveService, {provide: 'Window', useValue: {}}]
    });
  });

  it('should be created', inject([DriveService], (service: DriveService) => {
    expect(service).toBeTruthy();
  }));
});
