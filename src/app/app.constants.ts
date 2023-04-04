import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
  server: string;
  apiUrl: string;
  
  constructor() {
    this.server = environment.server;
    this.apiUrl = `${this.server}api/`;
  }
}
