import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import {MultiPartBuilder} from './multipart';
import { Character } from '../classes/character';
import { Metadata } from './metadata';

let keys: any;

try {
  keys = require('./keyfile.json');
} catch (e) {
  keys = undefined;
  console.log('Unable to load api keys. Saving to Drive will not be an option.');
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

  constructor( @Inject('Window') private window: any) {
    this.gapi = window['gapi'];

    if (keys) {
      this.CLIENT_ID = keys.clientId;
      this.API_KEY = keys.apiKey;
    }
  }

  initClient(): void {
    if (keys) {
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
  }

  updateSigninStatus(status: boolean): void {
    this.statusUpdatedSource.next(status);
  }

  isSignedIn(): boolean {
    if (this.gapi && this.gapi.auth2) {
      return this.gapi.auth2.getAuthInstance().isSignedIn.get();
    } else {
      return false;
    }
  }

  async retrieveSaveData(): Promise<Character> {
    if (this.gapi && this.gapi.client) {
      let data: Character;

      if (this.isSignedIn() && this.gapi.client) {
        const fileId = await this.getFileId();

        const fileResponse = await this.gapi.client.drive.files.get({
          'fileId': fileId,
          'alt': 'media'
        });

        const responseBody = JSON.parse(fileResponse.body);

        data = new Character();
        data.class = responseBody.class;
        data.experience = responseBody.experience;
        data.id = responseBody.id;
        data.name = responseBody.name;
      } else {
        data = new Character();
      }

      console.log(data);

      return data;
    }
  }

  /**
   * Retrieves the file ID by file name. If this file doesn't exist, create it.
   */
  async getFileId(): Promise<string> {
    if (this.gapi && this.gapi.client) {
      const request = await this.gapi.client.drive.files.list({
        'spaces': 'appDataFolder',
        'q': 'name="tome-save.json"'
      });
      const files = request.result.files;
      let fileId;
      if (files.length === 1) {
        fileId = request.result.files[0].id;
      } else if (files.length === 0) {
        const uploadRequest = await this.saveFile(new Metadata(), new Character());

        fileId = uploadRequest.result.id;
      }

      return fileId;
    }
  }

  /**
   * Persist the data on the Google Drive platform.
   * @param metadata Drive file metadata, such as id, name, etc.
   * @param content Character JSON payload to be sent to the server.
   */
  async saveFile(metadata: Metadata, content: Character) {
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
        .append(metadata.mimeType, JSON.stringify(content))
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

  async signIn(): Promise<void> {
    if (this.gapi && this.gapi.auth2) {
      await this.gapi.auth2.getAuthInstance().signIn();
      this.updateSigninStatus(true);
    }
  }

  async signOut(): Promise<void> {
    if (this.gapi && this.gapi.auth2) {
      await this.gapi.auth2.getAuthInstance().signOut();

      // Clear client data that we currently have.
      // this.gapi.client = undefined;
      this.updateSigninStatus(false);
    }
  }

}
