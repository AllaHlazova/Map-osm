import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit} from '@angular/core';
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
  public popup: Overlay;
  public zxczxc: any;

  constructor(public httpService: InfoCompaniesService,
              private cdRef: ChangeDetectorRef,
              private elRef: ElementRef
  ) {
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
    // create popup
    this.popup = new Overlay({
      element: document.getElementById('popup'),
    });

    this.httpService.getData().subscribe((data: Company[]) => {
      const vecSource = new Vector();
      const vecLayer = new VectorLayer({source: vecSource});
      this.map.addLayer(vecLayer);

      // create markers for every company
      data.forEach((company: Company, ind: number) => {
        const pos = fromLonLat([company.longitude, company.latitude]);
        // create markers
        const point = new Point(pos);

        const feature = new Feature({
          geometry: point,
          positioning: 'center-center',
          element: document.getElementById('marker'),
          stopEvent: false,
          html: true,
          name: company.company,
          data: company,
        });

        // style for company`s icons
        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            scale: company.isActive ? 0.05 : 0.02,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: company.isActive ? 'assets/marker-green.png' : 'assets/marker.png'
          }),
        });
        // добавьте его в источник
        feature.setStyle(iconStyle);
        vecSource.addFeature(feature);

        // Add handler event
      });
      this.map.addOverlay(this.popup);
      this.map.on([eventType.CLICK, eventType.DBLCLICK, eventType.LOAD], (ev: MapBrowserPointerEvent) => {

        const clickOn: Feature = this.map.forEachFeatureAtPixel(ev.pixel, (content) => {
          return content;
        });
        if (clickOn) {
          // console.log('getProperties', clickOn.getProperties().data);
          const companyInfo: Company = clickOn.getProperties().data;
          this.zxczxc = `<h2>${companyInfo.company}</h2>
                         <div>email:${companyInfo.email}</div>
                         <p id="close">click me</p>`;
          this.popup.setPosition(ev.coordinate);
          this.cdRef.detectChanges();
          this.elRef.nativeElement.querySelector('#close').addEventListener('click', () => this.smt(companyInfo));
        }
      });
    });
  }

  public smt(event: any): void {
    // console.log(event);
  }
}



