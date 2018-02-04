import { Component, OnInit } from '@angular/core';
import { DriveService } from './drive.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  signedIn = true;

  subscription: Subscription;

  constructor(private driveService: DriveService) {
    this.driveService = driveService;
    console.log(this.driveService.initClient);

    this.driveService.initClient();
  }

  ngOnInit() {
    this.driveService.statusUpdated$.subscribe(status => {
      this.signedIn = status;
    });
    this.signedIn = this.driveService.isSignedIn();
  }

  listFiles() {
    this.driveService.retrieveSaveData();
  }

  authorize() {
    this.driveService.signIn();
  }

  signOut() {
    this.driveService.signOut();
  }

}
