import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import {MultiPartBuilder} from './multipart';

let keys: any;

try {
  keys = require('./keyfile.json');

} catch (e) {
  console.log('Unable to load api keys. Saving to Drive will not be an option.')
}


declare const gapi: any;

@Injectable()
export class DriveService {
  private statusUpdatedSource = new Subject<boolean>();
  statusUpdated$ = this.statusUpdatedSource.asObservable();

  gapi: any;

  readonly CLIENT_ID: string;
  readonly API_KEY: string;

  // Array of API discovery doc URLs for APIs used by the quickstart
  readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

  doc: Document;

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  readonly SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
  readonly  DEFAULT_FIELDS = 'id,name,mimeType,spaces';

  constructor( @Inject('Window') private window: Window) {
    this.gapi = window['gapi'];

    if (keys) {
      this.CLIENT_ID = keys.clientId;
      this.API_KEY = keys.apiKey;
    }
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

  async retrieveSaveData() {
    let data;

    if (this.isSignedIn() && this.gapi.client) {
      const fileId = await this.getFileId();

      const fileResponse = await this.gapi.client.drive.files.get({
        'fileId': fileId,
        'alt': 'media'
      });

      data = JSON.parse(fileResponse.body);
    } else {
      data = {};
    }

    return data;
  }

  async getFileId() {
    const request = await this.gapi.client.drive.files.list({
      'spaces': 'appDataFolder',
      'q': 'name="tome-save.json"'
    });
    const files = request.result.files;
    let fileId;
    if (files.length === 1) {
      fileId = request.result.files[0].id;
    } else if (files.length === 0) {
      const metadata = {
        id: null,
        name: 'tome-save.json',
        mimeType: 'text/plain',
        parents: ['appDataFolder'],
        editable: true
      };
      const uploadRequest = await this.saveFile(metadata, '{}');

      fileId = uploadRequest.result.id;
    }

    return fileId;
  }

  async saveFile(metadata, content) {
      let path;
      let method;

      if (metadata.id) {
        path = '/upload/drive/v3/files/' + encodeURIComponent(metadata.id);
        method = 'PUT';
      } else {
        path = '/upload/drive/v3/files';
        method = 'POST';
      }

      const multipart = new MultiPartBuilder()
        .append('application/json', JSON.stringify(metadata))
        .append(metadata.mimeType, content)
        .finish();
      try {
        const uploadRequest = await gapi.client.request({
          path: path,
          method: method,
          params: {
            uploadType: 'multipart',
            supportsTeamDrives: true,
            fields: this.DEFAULT_FIELDS
          },
          headers: { 'Content-Type' : multipart.type },
          body: multipart.body
        });

        return uploadRequest;
      } catch (e) {
        console.log(e);
      }
      return null;
  }

  async signIn() {
    await this.gapi.auth2.getAuthInstance().signIn();
    this.updateSigninStatus(true);
  }

  async signOut() {
    await this.gapi.auth2.getAuthInstance().signOut();

    // Clear client data that we currently have.
    // this.gapi.client = undefined;
    this.updateSigninStatus(false);
  }

}
