import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { LatLngLiteral } from 'google-maps';


interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'app-visita-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapVisitasComponent implements OnInit {

  infoWindowOpened = null;
  latitude: number;
  longitude: number;
  zoom: number;
  infoText: string;

  constructor(private router: Router) { }

  /**/
  @Input()
  set markers(markers: any[]) {
    this._markers = markers;
  }
  get markers(): any[] { return this._markers; }
  _markers: any;

  ngOnInit() {
    this.setCurrentLocation();
  }

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
    const productoFruta = `${item.producto} - ${item.tipoFruta}`;
    
    // Accuracy
    const geopositionSplit = (item.geoposition) 
      ? (item.geoposition.split('||')) ? item.geoposition.split('||') : null 
      : null;
    const accuracy = (geopositionSplit && geopositionSplit[0] && geopositionSplit[0].split(': ')) 
      ? (geopositionSplit[0].split(': ')[1]) ? geopositionSplit[0].split(': ')[1] : ''
      : '';
    const altitude = (geopositionSplit && geopositionSplit[1] && geopositionSplit[1].split(': ')) 
      ? (geopositionSplit[1].split(': ')[1]) ? geopositionSplit[1].split(': ')[1] : ''
      : '';
    const altitudeAccuracy = (geopositionSplit && geopositionSplit[2] && geopositionSplit[2].split(': ')) 
      ? (geopositionSplit[2].split(': ')[1]) ? geopositionSplit[2].split(': ')[1] : ''
      : '';

    this.infoText = `
      Visita Folio: ${item.idvisita || ''}
      Huerta: ${item.huerta_huerta_idhuerta || ''}
      Productor: ${item.productor_productor_idproductor || ''}
      -------------------
      Producto: ${productoFruta}
      Toneladas: ${item.toneladas}
      32's: ${item.super32}%
      36's: ${item.super36}%
      40's: ${item.super40}%
      48's: ${item.extra}%
      60's.: ${item.primeras}%
      70's.: ${item.segundas}%
      84's.: ${item.terceras}%
      4tas.: ${item.cuartas}%
      B: ${item.b}%
      -------------------
      Latitude: ${item.lat}
      Longitude: ${item.lng}
      Accuracy: ${accuracy}
      Altitude: ${altitude}
      AltitudeAccuracy: ${altitudeAccuracy}
    `;
  }

    verItem(item: any) {
      this.router.navigate([`/pages/visitas/${item.idvisita}`, item]);
    }

}
