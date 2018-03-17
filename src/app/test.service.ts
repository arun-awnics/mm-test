import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TestService {

  private url = 'http://35.226.156.161:3000/messages';

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any[]> {
    return this.http.get(this.url)
    .pipe(
      map(res => res)
    )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
