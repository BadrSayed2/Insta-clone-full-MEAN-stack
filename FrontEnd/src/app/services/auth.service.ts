import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url:string ="" 
  constructor(private httpClient :HttpClient) { }

  addUser(userData: any){
    this.url="http://localhost:4000/auth/signup"
    return this.httpClient.post(this.url , userData )
  }

  loginUser(userData: any){
    this.url="http://localhost:4000/auth/login"
    return this.httpClient.post(this.url , userData )
  }
  verify(userData: any) {
  this.url = "http://localhost:4000/auth/verify_otp";
  return this.httpClient.post(this.url, userData, { withCredentials: true });
}
  resetPassword(token: string, newPassword: string){
      this.url = `http://localhost:4000/auth/reset-password?token=${token}`;
      return this.httpClient.post(this.url,{ newPassword },{ withCredentials: true } );
    }
}
