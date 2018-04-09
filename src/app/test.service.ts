import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as io from 'socket.io-client';

@Injectable()
export class TestService {

  private socket: any;
  private baseUrl = 'http://35.226.156.161:3000';

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any[]> {
    const uri = `${this.baseUrl}/messages`;
    return this.http.get(uri)
      .pipe(
        map(res => res)
      )
      .catch(this.handleError);
  }

  connection(userId: number) {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJmaXJzdG5hbWUiOiJBcnVuIiwibGFzdG5hbWUiOiJHYWRhZyIsImVtYWlsIjoiYXJ1bkBhd25pY3MuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkMldNL2hpdW16blFMT2JqdkNJc1paZVg1VUxwS3NEY1ZpOS50RjdSYUVyVXg0VS5yY25BMmkiLCJwaG9uZU5vIjoiODk3MDA3NDc3NyIsInBpY1VybCI6IiIsImRlc2NyaXB0aW9uIjpudWxsLCJzdGF0dXMiOiJvZmZsaW5lIiwid2FpdGluZ1RpbWUiOm51bGwsInJhdGluZyI6bnVsbCwidG9rZW4iOiI2NzUzZjVlMzdmZjEzZGQzIiwiYWN0aXZhdGUiOiIxIiwicm9sZSI6InBhdGllbnQiLCJzb2NrZXRJZCI6ImtOQjVpN29yT2VucEJzaE1BQUFWIiwiY3JlYXRlZEJ5IjoiQXJ1bkdhZGFnIiwidXBkYXRlZEJ5IjoiQXJ1bkdhZGFnIiwiY3JlYXRlZEF0IjoiMjAxOC0wNC0wNlQyMToyMzoxNy4wMDBaIiwidXBkYXRlZEF0IjoiMjAxOC0wNC0wOVQxNjo1NzoyNy4wMDBaIn0sImV4cCI6MTUyMzg5Nzg4OCwiaWF0IjoxNTIzMjkzMDg4fQ._oTZRRQeaIfb3FujeiX0qCpDsiqYY_eaz8Ti86RkuCY`;
    this.socket = io(`${this.baseUrl}`, {
      query: { token: token },
      secure: true
    });
    this.socket.on('connect', () => {
      this.socket.emit('user-connected', userId);
    });
  }

  sendMessage(message: any) {
    this.socket.emit('send-message', message);
  }

  receiveMessages(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('receive-message', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
