import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/auth/check';
  client_obs: Observable<any[]>;


  constructor(private httpClient: HttpClient) {
    this.client_obs = this.httpClient.get<any[]>(this.apiUrl, {
      withCredentials: true
    })
  }

  check_is_loggedin(): boolean {
    let result = false
    this.client_obs.subscribe((res: any) => {
      result = res.success
    })
    return result;
  }

}
