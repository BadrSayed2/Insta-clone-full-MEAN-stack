import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
export interface Post {
  id: number;
  username: string;
  userId: number;
  mediaUrl: string;
  caption: string;
  privacy: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T | null;
}
@Injectable({
  providedIn: "root",
})
export class PostService {
  private apiUrl = "http://localhost:4000/posts";
  constructor(private http: HttpClient) {}
  createPost(form: FormData): Observable<HttpResponse<ApiResponse>> {
    return this.http.post<ApiResponse>(this.apiUrl, form, {
      observe: "response",
    });
  }

  getMyPosts(): Observable<
    Array<{
      _id: string;
      caption: string;
      media: { url: string; publicId: string; media_type: "picture" | "video" };
      userId: string;
      commentsNumber: number;
      likesNumber: number;
      privacy: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }>
  > {
    return this.http
      .get<ApiResponse<any[]>>(`${this.apiUrl}/me`) //{ withCredentials: true }
      .pipe(map((res) => res.data || []));
  }
}
