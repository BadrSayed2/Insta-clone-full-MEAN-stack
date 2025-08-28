import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:4000/posts/';
  private client_obs: Observable<any[]>;
  private selected_post_id :string = "";

  constructor(private httpClient: HttpClient) {
    this.client_obs = this.httpClient.get<any[]>(this.apiUrl + "feed",{
      withCredentials : true
    })
    
  }

  get_posts ():Observable<any[]>{
    return this.client_obs;
  }
  get_selected_post_id (){
    return this.selected_post_id
  }
  get_selectedPost () : Observable<any>{
    return this.httpClient.get<any>(this.apiUrl + this.selected_post_id,{
      withCredentials : true
    })
  }

  select_post (post_id :string) : void{
    this.selected_post_id = post_id
  }

}
