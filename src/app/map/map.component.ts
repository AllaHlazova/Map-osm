import {Component, OnInit} from '@angular/core';
import {Company} from '../../services/company';
import {InfoCompaniesService} from '../../services/InfoCompanies.service';

import Map from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import Vector from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import {fromLonLat} from 'ol/proj';
import eventType from 'ol/events/EventType';
import MapBrowserPointerEvent from 'ol/MapBrowserEvent';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public infoComps: Company[] = [];
  public map: Map;
  public layer: TileLayer;
  // public feature: Feature;
  public popup: Overlay;

  constructor(public httpService: InfoCompaniesService) {
  }

  ngOnInit() {
    // request to server
    this.httpService.getData().subscribe((data: Company[]) => this.infoComps = data);

    // OSM
    this.layer = new TileLayer({
      source: new OSM()
    });

    this.map = new Map({
      layers: [
        this.layer
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      })
    });
    this.popup = new Overlay({
      element: document.getElementById('popup')
    });

    this.httpService.getData().subscribe((data: Company[]) => {
      const vecSource = new Vector();
      const vecLayer = new VectorLayer({source: vecSource});
      this.map.addLayer(vecLayer);

      // create markers for every company
      data.forEach((company: Company, ind: number) => {
        const pos = fromLonLat([company.longitude, company.latitude]);
        // создать маркер
        const point = new Point(pos);

        // const name = company.company ? 'comp' : 'company unknow';
        const name = company.company;
        // console.log(name);
        const feature = new Feature({
          geometry: point,
          positioning: 'center-center',
          element: document.getElementById('marker'),
          stopEvent: false,
          html: true,
          content: '<p>name</p>',
          // content: '<p>The location you clicked was:</p><code>' + hdms + '</code>'

          // content: '<div><p>Name:</p>' + name + '</div>',

          // style: company.isActive ? '' : '',
        });

        // style for company`s icons
        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            scale: company.isActive ? 0.05 : 0.02,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: company.isActive ? 'assets/marker-green.png' : 'assets/marker.png'
          })
        });
        // добавьте его в источник
        feature.setStyle(iconStyle);
        vecSource.addFeature(feature);

        // Add handler event
      });
      this.map.addOverlay(this.popup);
      this.map.on([eventType.CLICK, eventType.DBLCLICK, eventType.LOAD], (ev: MapBrowserPointerEvent) => {
        const feature1: Feature = this.map.forEachFeatureAtPixel(ev.pixel, (feature2) => {
          return feature2;
        });
        if (feature1) {
          this.popup.setPosition(ev.coordinate);
        }
      });

    });
  }
}



