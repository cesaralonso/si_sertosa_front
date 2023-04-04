import { SessionService } from '../../../../shared/services/session.service';
import { Message } from '../../../../shared/models/message.model';
import { SocketIOService } from '../../../../shared/services/socketio.service';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment-timezone';


interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'app-tracking-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class TrackingMapComponent implements OnInit {

  infoWindowOpened = null;

  latitude: number;
  longitude: number;
  zoom: number;
  infoText: string;
  markers = [];

  constructor(
    private socketIOService: SocketIOService,
    private sessionService: SessionService) { }

  ngOnInit() {
    this.setCurrentLocation();

    // Obtener posiciones de tabla sesion, sus últimas posiciones registradas
    this.sessionService.all().toPromise().then(response => {
      const sesiones = response.result;
      sesiones.forEach(sesion => {

        const fechaHora = moment(sesion.modified_at).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const track = {
            lat: sesion.latitude,
            lng: sesion.longitude,
            accuracy: sesion.accuracy || 0,
            nombre: sesion.usuario || sesion.email,
            hora: fechaHora.split(' ')[1],
            fecha: fechaHora.split(' ')[0],
            radius: 300,
            color: '#00f',
            iconUrl: 'assets/img/theme/target-rojo.png'
          };
        this.markers.push(track);
      });
    });

    // subscribe to TrackingService
    this.socketIOService.onTracking()
      .subscribe((tracking: Message) => {
      console.log('tracking', tracking);

        // borrar marker de email
        const coords = tracking.content.coords;
        const track = {
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy,
          nombre: (tracking.from.usuario || tracking.from.email) + ' Real Time',
          hora: tracking.hour,
          fecha: tracking.date,
          radius: 300,
          color: '#00f',
          iconUrl: (coords.accuracy > 200 
                      ? 'assets/img/theme/target-amarillo.png' 
                      : (coords.accuracy <= 30 ? 'assets/img/theme/target-verde.png' : 'assets/img/theme/target-azul.png'))
        };

        this.markers = this.markers.filter(o => o.nombre !== track.nombre);
        this.markers.push(track);
      });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
      // centro inicial
      this.latitude = 19.6989044;
      this.longitude = -103.4796106;
      this.zoom = 8;
  }

  clickedMarker(item: any, infoWindow) {
    if (this.infoWindowOpened === infoWindow) {
      return;
    }
    if (this.infoWindowOpened !== null) {
      this.infoWindowOpened.close();
    }
    this.infoWindowOpened = infoWindow;   

    this.infoText = `
      acopiador: ${item.nombre}
      hora: ${item.hora}
      fecha: ${item.fecha}
      presición: ${item.accuracy}
    `;
  }

  backPage() {
    window.history.back();
  }
}
