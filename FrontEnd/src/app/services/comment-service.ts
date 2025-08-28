import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  
  private apiUrl = 'http://localhost:4000/posts/';

  constructor(private httpClient: HttpClient) {  }

  get_comments (postId : string):Observable<any>{
    return this.httpClient.get<any>(this.apiUrl + "comment/" + postId,{
      withCredentials : true
    })
  }

  add_comment (postId : string , comment : string){
    return this.httpClient.post(this.apiUrl + "comment/" + postId,{comment  },{withCredentials : true})
  }
}

/**
 * 
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
 */