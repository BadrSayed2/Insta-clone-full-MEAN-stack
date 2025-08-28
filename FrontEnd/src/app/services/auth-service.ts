import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/auth/';

  private is_logged_in: boolean = false

  get_is_loggedin() {
    return this.is_logged_in
  }
  constructor(private httpClient: HttpClient) {
    this.check_is_loggedin()
    // setTimeout(this.check_is_loggedin,1000)
  }

 check_is_loggedin(): Observable<boolean> {
    return this.httpClient.get<any>(this.apiUrl + "check", {
      withCredentials: true
    }).pipe(
      map(res => res?.success === true),
      catchError(() => of(false)) 
    );
  }



  verify_otp(code: string) {
    return this.httpClient.post<any>(this.apiUrl + "verify_otp", { code }, {
      withCredentials: true
    })
  }

}
