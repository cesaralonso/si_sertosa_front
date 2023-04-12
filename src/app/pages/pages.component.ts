import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { OnlineOfflineService } from '../shared/services/online-offline.service';
import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

/* import { AppState } from 'app/app.service';
import { SocketIOService } from '../shared/services/socketio.service';
import { Message, Type } from '../shared/models';
import * as moment from 'moment-timezone';
import { IndexedDbService } from 'app/shared/services/indexeddb.service';
var watchId = 0; */

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class='al-footer-right'>si_sertosa2_6411ce4229fd4 v0.0.1</div>
      <div class="al-footer-main clearfix">
        <ul class="al-share clearfix">
          <li></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages implements OnInit {

  online = true;

  /* watchId: string;
  lastTrack = moment(new Date());
  lastTrackSocket = moment(new Date());
  lastLat = '';
  lastLng = '';
  coords: any = {
    latitude: 0,
    longitude: 0,
    accuracy: 0
  }; */


  constructor(
    private _menuService: BaMenuService,
    private onlineOfflineService: OnlineOfflineService,
    private authService: AuthService
    /* private indexedDbService: IndexedDbService,
    private appState: AppState,
    private socketIOService: SocketIOService */) {
  }

  ngOnInit() {
    // Registro para momento en que sean obtenidos módulos de usuario
    this.registerToMenu();

    // Reistro a evento online/offline 
    this.registerToEvents(this.onlineOfflineService);

    // Registro a evento tracking 
    /* this.registerToTracking(); */
  }

  private registerToMenu() {
    const userModules = this.authService.getUserModules();
    const user = this.authService.useJwtHelper();
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU, user, userModules);
  }
  private registerToEvents(onlineOfflineService: OnlineOfflineService) {
      onlineOfflineService.connectionChanged.subscribe(online => {
          this.online = online;
          if (online) {
              console.log('went online, sending all stored items');
          } else {
              console.log('went offline, storing in indexdb');
          }
      });
  }

}
