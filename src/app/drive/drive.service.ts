import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

const keys = require('./keyfile.json');


declare const gapi: any;

@Injectable()
export class DriveService {
  private statusUpdatedSource = new Subject<boolean>();
  statusUpdated$ = this.statusUpdatedSource.asObservable();

  gapi: any;

  readonly CLIENT_ID = keys.clientId;
  readonly API_KEY = keys.apiKey;

  // Array of API discovery doc URLs for APIs used by the quickstart
  readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

  doc: Document;

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  readonly SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  constructor( @Inject('Window') private window: Window) {
    this.gapi = window['gapi'];
  }

  initClient() {
    this.gapi.load('client:auth2', async () => {
       await this.gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES
      });
      this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));

      this.updateSigninStatus(this.isSignedIn());
    });
  }

  updateSigninStatus(status: boolean) {
    this.statusUpdatedSource.next(status);
  }

  isSignedIn(): boolean {
    if (this.gapi && this.gapi.auth2) {
      return this.gapi.auth2.getAuthInstance().isSignedIn.get();
    } else {
      return false;
    }
  }

  async signIn() {
    await this.gapi.auth2.getAuthInstance().signIn();
    this.updateSigninStatus(true);
  }

  async signOut() {
    await this.gapi.auth2.getAuthInstance().signOut();
    this.updateSigninStatus(false);
  }

}
