import {SanitizeHtmlPipe} from './sanitize-html.pipe';
import {TestBed} from '@angular/core/testing';
import {DomSanitizer} from '@angular/platform-browser';

describe('SanitizeHtmlPipe', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [SanitizeHtmlPipe],
    providers: [
      SanitizeHtmlPipe,
      {
        provide: DomSanitizer, useValue: {
          bypassSecurityTrustResourceUrl() {}
        }
      }
    ]
  }));

  it('create an instance', () => {
    const pipe = TestBed.get(SanitizeHtmlPipe);
    expect(pipe).toBeTruthy();
  });

});
