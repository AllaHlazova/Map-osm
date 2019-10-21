import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {MapComponent} from './map/map.component';

const ROUTERS: Route[] = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: MapComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTERS)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
