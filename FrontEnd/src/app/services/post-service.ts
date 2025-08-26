import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:4000/posts/';
  client_obs: Observable<any[]>;


  constructor(private httpClient: HttpClient) {
    this.client_obs = this.httpClient.get<any[]>(this.apiUrl + "feed",{
      withCredentials : true
    })
  }

  get_posts ():Observable<any[]>{
    return this.client_obs;
  }

}
