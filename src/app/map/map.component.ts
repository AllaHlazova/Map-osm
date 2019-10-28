import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
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

  public map: Map;
  public layer: TileLayer;
  public popup: Overlay;
  public content: any;

  constructor(public httpService: InfoCompaniesService,
              private cdRef: ChangeDetectorRef,
              private elRef: ElementRef) {
  }

  ngOnInit() {
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
        maxZoom: 20,
      })
    });
    // create popup
    this.popup = new Overlay({
      element: document.getElementById('popup')
    });
    this.httpService.getData().subscribe((data: Company[]) => {
      const vecSource = new Vector();
      const vecLayer = new VectorLayer({source: vecSource});
      this.map.addLayer(vecLayer);
      // create markers for every company
      // request to server
      data.forEach((company: Company) => {
        const pos = fromLonLat([company.longitude, company.latitude]);
        // create markers with coordinate
        const point = new Point(pos);
        const feature = new Feature({
          geometry: point,
          positioning: 'center-center',
          element: document.getElementById('marker'),
          stopEvent: false,
          html: true,
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
        feature.setStyle(iconStyle);
        vecSource.addFeature(feature);
      });
      this.map.addOverlay(this.popup);
      this.map.on([eventType.CLICK, eventType.DBLCLICK, eventType.LOAD], (ev: MapBrowserPointerEvent) => {
        const clickOn: Feature = this.map.forEachFeatureAtPixel(ev.pixel, (content) => {
          return content;
        });
        if (clickOn) {
          const companyInfo: Company = clickOn.getProperties().data;
          this.content = `<div class="d-flex">
                            <div class="flex-column">
                               <div>Company: ${companyInfo.company}</div>
                               <div>Email: ${companyInfo.email}</div>
                               <div>Address: ${companyInfo.address}</div>
                           </div>
                           <div class="flex-column">
                              <i id="close" class="fas fa-window-close icon"></i>
                           </div>
                         </div>`;
          this.popup.setPosition(ev.coordinate);
          this.cdRef.detectChanges();
          this.elRef.nativeElement.querySelector('#close').addEventListener('click', () => this.close());
        }
      });
    });
  }
  public close(): void {
    // clear html content
    this.content = '';
    this.popup.setPosition(null);
  }
}
