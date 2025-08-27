import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, delay, map } from "rxjs";

export interface UserSummary {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  isFollowing: boolean;
}

@Injectable({ providedIn: "root" })
export class UserService {
  apiUrl = `http://localhost:4000/users/me`;
  constructor(private http: HttpClient) {}
  // Shape returned by backend for /users/me
  getUserProfile(): Observable<{
    userName: string;
    fullName: string;
    accessability: string;
    profile_pic: string | null;
    bio?: string;
    gender?: string;
    date_of_birth?: string;
    followCount: number;
    followingCount: number;
    postsCount: number;
    createdAt: string;
    updatedAt: string;
  }> {
    return this.http
      .get<{ status: string; message: string; data: { profile: any } }>(
        this.apiUrl
        // { withCredentials: true }
      )
      .pipe(map((res) => res.data.profile || {}));
  }

  getFollowers(profileId: string): Observable<UserSummary[]> {
    const data: UserSummary[] = [
      {
        id: "u1",
        username: "alice",
        fullName: "Alice Johnson",
        avatarUrl: "",
        isFollowing: false,
      },
      {
        id: "u2",
        username: "bob",
        fullName: "Bob Smith",
        avatarUrl: "",
        isFollowing: true,
      },
      {
        id: "u3",
        username: "charlie",
        fullName: "Charlie Brown",
        avatarUrl: "",
        isFollowing: false,
      },
      {
        id: "u4",
        username: "diana",
        fullName: "Diana Prince",
        avatarUrl: "",
        isFollowing: true,
      },
      {
        id: "u5",
        username: "edgar",
        fullName: "Edgar Poe",
        avatarUrl: "",
        isFollowing: false,
      },
      {
        id: "u6",
        username: "frank",
        fullName: "Frank Castle",
        avatarUrl: "",
        isFollowing: true,
      },
      {
        id: "u7",
        username: "grace",
        fullName: "Grace Hopper",
        avatarUrl: "",
        isFollowing: true,
      },
      {
        id: "u8",
        username: "hank",
        fullName: "Hank Pym",
        avatarUrl: "",
        isFollowing: true,
      },
      {
        id: "u9",
        username: "ivy",
        fullName: "Ivy Green",
        avatarUrl: "",
        isFollowing: true,
      },
      {
        id: "u10",
        username: "jack",
        fullName: "Jack Ryan",
        avatarUrl: "",
        isFollowing: true,
      },
    ];
    return of(data).pipe(delay(200));
  }
}
