import {Component, OnInit} from '@angular/core';
import {Company} from '../../services/company';
import {InfoCompaniesService} from '../../services/InfoCompanies.service';

import Map from 'ol/Map';
import * as ol from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import Vector from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import {toStringHDMS} from 'ol/coordinate';
import {fromLonLat, toLonLat} from 'ol/proj';
import {style} from '@angular/animations';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public infoComps: Company[] = [];
  public map: Map;
  public layer: TileLayer;

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

    this.httpService.getData().subscribe((data: Company[]) => {
      const vecSource = new Vector();
      const vecLayer = new VectorLayer({source: vecSource});
      this.map.addLayer(vecLayer);

      // create markers for every company
      data.forEach((company: Company, ind: number) => {
        const pos = fromLonLat([company.longitude, company.latitude]);

        // создать маркер
        const feature: Feature = new Feature({
          geometry: new Point(pos),
          positioning: 'center-center',
          element: document.getElementById('marker'),
          stopEvent: false,
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
      });


      // Add a click handler to the map to render the popup.
      // this.map.on('singleclick', (evt) => {
      //   const coordinate = evt.infoComps;
      //   // const hdms = toStringHDMS(toLonLat(coordinate));
      //   const infoComps = '<div>company?.company</div>' + '<div>company?.email</div>';
      //   this.map.getTargetElement().innerHTML = '<p>Info company:</p><code>' + infoComps +
      //     '</code>';
      //   this.map.setPosition(coordinate);
      // });
      const selectControl = new Map.Control.SelectFeature(vecLayer, {
        hover: true
      });
      selectControl.events.register('featurehighlighted', null);


      // Popup showing the position the user clicked
      // const popup = new Overlay({
      //   element: document.getElementById('popup')
      // });
      // this.map.addOverlay(popup);
      // this.map.on('click', (evt) => {
      //   const element = popup.getElement();
      //   const coordinate = evt.coordinate;
      //   const hdms = toStringHDMS(toLonLat(coordinate));
      //
      //   this.map.on(element).popover('dispose');
      //   popup.setPosition(coordinate);
      //   this.map.on(element).popover({
      //     placement: 'top',
      //     animation: true,
      //     html: true,
      //     content: '<p>The location you clicked was:</p><code>' + hdms + '</code>'
      //   });
      //   this.map.on(element).popover('show');
      // });
    });
  }
}

//     // all markers
//     const marker = new Overlay({
//       position: pos,
//       positioning: 'center-center',
//       element: document.getElementById('marker'),
//       stopEvent: false
//     });
//     this.map.addOverlay(marker);
//
//     // console.log(marker);
//     // console.log(this.map.getOverlays());
//   });
// });
// // fromLonLat([16.3725, 48.208889]);


// Vienna label
// this.vienna = new Overlay({
//   position: pos,
//   element: document.getElementById('vienna')
// });
// this.map.addOverlay(this.vienna);


// // Popup showing the position the user clicked
// const popup = new Overlay({
//   element: document.getElementById('popup')
// });
// this.map.addOverlay(popup);
// this.map.on('click', function(evt) {
//   const element = popup.getElement();
//   const coordinate = evt.coordinate;
//   const hdms = toStringHDMS(toLonLat(coordinate));


// $(element).popover('dispose');
// popup.setPosition(coordinate);
// $(element).popover({
//   placement: 'top',
//   animation: true,
//   html: true,
//   content: '<p>The location you clicked was:</p><code>' + hdms + '</code>'
// });
// $(element).popover('show');
// });
//   });
// }


// this.map = new Map({
//   target: 'map',
//   layers: [
//     new TileLayer({
//       source: new XYZ({
//         url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//       })
//     })
//   ],
//   view: new View({
//     center: [0, 0],
//     zoom: 2
//   })
// });

