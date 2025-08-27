import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
  status: string; // "success" | "error" | etc.
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
}
