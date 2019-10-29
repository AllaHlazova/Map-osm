import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Company} from './company';

@Injectable({
  providedIn: 'root'
})
export class InfoCompaniesService {

  constructor(private http: HttpClient) {}

  public getData(): Observable<Company[]> {
    return this.http.get('/assets/list-of-companies.json') as Observable<Company[]>;
  }
}

