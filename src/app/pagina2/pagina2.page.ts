import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html',
  styleUrls: ['./pagina2.page.scss'],
})
export class Pagina2Page implements OnInit {

  map: L.Map;

  constructor() { }

  ngOnInit() {
  }

    ionViewDidEnter(){
    this.loadMap();
  }

  loadMap() {
    let latitud = 40.4468632;
    let longitud = -3.6557122;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
  }

}
