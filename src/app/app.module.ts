import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app.routing.module';
import {MapComponent} from './map/map.component';
import {SanitizeHtmlPipe} from './pipes/sanitize-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [SanitizeHtmlPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
