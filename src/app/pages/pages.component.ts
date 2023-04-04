import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
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
      this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
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

  /* private async registerToTracking() {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    const options = {
      enableHighAccuracy: (!this.online) ? true : false, // SI ES OFFLINE EN TRUE
      timeout: 0,
      maximumAge: 0
    };
    watchId = navigator.geolocation.watchPosition(async (position) => {
      console.log('Geolocation Position', position);
      if (position && position.coords) {
          const coords: any = position.coords;
          
          if (coords.latitude !== this.lastLat || coords.longitude !== this.lastLng) {
              this.lastLat = coords.latitude;
              this.lastLng = coords.longitude;
              this.coords = coords;
          
              const _stateCoords = {
                  accuracy: coords.accuracy,
                  latitude: coords.latitude,
                  longitude: coords.longitude
              };
              this.appState.set('coords', _stateCoords);

              if (coords.accuracy < 300) {

                  const newCreatedAt = moment(new Date());
                  const diffSeconds = newCreatedAt.diff(this.lastTrack, 'seconds');
                  const diffSecondsSocket = newCreatedAt.diff(this.lastTrackSocket, 'seconds');
              
                  const posicion: any = {
                      latitude: coords.latitude,
                      longitude: coords.longitude,
                      accuracy: coords.accuracy
                  };

                  // SOLO CADA 30 SEGS.
                  if (diffSecondsSocket > 30) {
                      this.lastTrackSocket = moment(new Date());
                      const alerta: Message = {
                          type: Type.TRACKING,
                          content: {
                              category: 'TRACKING',
                              coords: posicion
                          }
                      };
                      this.socketIOService.send(alerta);
                  }

                  // Si tiene poco rango de error
                  if (coords.accuracy < 200) {
                      // SOLO CADA 2 MINUTOS
                      if (diffSeconds > 120) {
                          this.lastTrack = moment(new Date());

                          // SI NO ESTÁ EN LINEA
                          if (!this.onlineOfflineService.isOnline) {

                              // INICIALMENTE GUARDA EN MEMORIA
                              posicion.created_at = moment(new Date()).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                              this.indexedDbService.addPosicionToIndexedDb(posicion);

                          } else {
                              // GUARDA EN LINEA

                          }
                      }
                  }
              }
          }
      } 
    }, (err) => {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }, options);
  } */

}
