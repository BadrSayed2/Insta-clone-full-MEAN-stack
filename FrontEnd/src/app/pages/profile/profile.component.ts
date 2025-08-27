import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { UserService, UserSummary } from "app/services/user.service";
import { PostService } from "app/services/post.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  activeTab = "posts";
  loading = false;
  // Modal state
  showFollowersModal = false;
  showFollowingModal = false;
  // Search state
  searchFollowers = "";
  searchFollowing = "";
  // Data
  followers: UserSummary[] = [];
  following: UserSummary[] = [];

  profile: any = {
    username: "",
    fullName: "",
    bio: "",
    website: "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    profile_pic: "",
  };

  highlights = [
    { name: "Travel", cover: "" },
    { name: "Food", cover: "" },
    { name: "Nature", cover: "" },
    { name: "Friends", cover: "" },
  ];

  tabs = [
    {
      key: "posts",
      label: "POSTS",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
    {
      key: "reels",
      label: "REELS",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    },
    {
      key: "tagged",
      label: "TAGGED",
      icon: "M7 7h.01M7 3h5l3 3v5a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z",
    },
  ];

  posts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const username = params["username"];
    });
    // Load my profile
    this.loading = true;
    this.userService.getUserProfile().subscribe({
      next: (p) => {
        // Map backend fields to view model
        this.profile = {
          username: p.userName,
          fullName: p.fullName,
          bio: p.bio || "",
          website: "",
          postsCount: p.postsCount ?? 0,
          followersCount: p.followCount ?? 0,
          followingCount: p.followingCount ?? 0,
          profile_pic: p.profile_pic || "",
        };
      },
      error: (e) => console.error("Failed to load profile", e),
      complete: () => (this.loading = false),
    });
    // Load my posts for profile grid
    this.postService.getMyPosts().subscribe({
      next: (posts) => (this.posts = posts || []),
      error: (e) => console.error("Failed to load posts", e),
    });
  }
  //! search in followers not handled yet
  // Derived lists with filter
  get filteredFollowers(): UserSummary[] {
    const q = this.searchFollowers.trim().toLowerCase();
    if (!q) return this.followers;
    return this.followers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
    );
  }
  //! search in following not handled yet
  get filteredFollowing(): UserSummary[] {
    const q = this.searchFollowing.trim().toLowerCase();
    if (!q) return this.following;
    return this.following.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
    );
  }
  //! open followers modal
  openFollowersModal() {
    if (!this.followers.length) this.loadFollowers();
    this.showFollowersModal = true;
  }
  //! open following modal
  openFollowingModal() {
    if (!this.following.length) this.loadFollowing();
    this.showFollowingModal = true;
  }
  //! close modals followers and following not handled
  closeModals() {
    this.showFollowersModal = false;
    this.showFollowingModal = false;
  }

  onSearchChange() {}

  toggleFollow(user: UserSummary) {
    user.isFollowing = !user.isFollowing;
  }

  trackByUserId(_index: number, user: UserSummary) {
    return user.id;
  }
  //! get followers not handled yet
  private loadFollowers() {
    const profileId = this.profile.username; // or route param id
    this.userService
      .getFollowers(profileId)
      .subscribe((users: UserSummary[]) => {
        this.followers = users;
      });
  }
  //! get following not handled yet
  private loadFollowing() {
    const profileId = this.profile.username; // or route param id
    this.userService
      .getFollowing(profileId)
      .subscribe((users: UserSummary[]) => {
        this.following = users;
      });
  }
}
