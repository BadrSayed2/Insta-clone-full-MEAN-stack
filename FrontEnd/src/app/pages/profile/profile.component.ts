import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4">
      <!-- Profile Header -->
      <header
        class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8"
      >
        <div class="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0"></div>

        <div class="flex-1 text-center md:text-left">
          <div
            class="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4"
          >
            <h1 class="text-2xl font-light">{{ profile.username }}</h1>
            <div class="flex space-x-2 mt-2 md:mt-0">
              <button class="btn-secondary">Edit profile</button>
              <button class="btn-secondary">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex justify-center md:justify-start space-x-8 mb-4">
            <div class="text-center">
              <div class="font-semibold">{{ profile.postsCount }}</div>
              <div class="text-instagram-gray text-sm">posts</div>
            </div>
            <div class="text-center">
              <div class="font-semibold">{{ profile.followersCount }}</div>
              <div class="text-instagram-gray text-sm">followers</div>
            </div>
            <div class="text-center">
              <div class="font-semibold">{{ profile.followingCount }}</div>
              <div class="text-instagram-gray text-sm">following</div>
            </div>
          </div>

          <div class="space-y-1">
            <h2 class="font-semibold">{{ profile.fullName }}</h2>
            <p class="text-sm">{{ profile.bio }}</p>
            <a href="#" class="text-instagram-blue text-sm hover:underline">{{
              profile.website
            }}</a>
          </div>
        </div>
      </header>

      <!-- Highlights -->
      <section class="mb-8">
        <div class="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
          <div
            *ngFor="let highlight of highlights"
            class="flex flex-col items-center space-y-2 flex-shrink-0"
          >
            <div
              class="w-16 h-16 bg-gray-300 rounded-full border-2 border-gray-300"
            ></div>
            <span class="text-xs text-center max-w-16 truncate">{{
              highlight.name
            }}</span>
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <nav class="border-t border-instagram-border dark:border-gray-800">
        <div class="flex justify-center">
          <button
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.key"
            class="flex items-center space-x-1 px-4 py-3 text-xs font-semibold tracking-wide border-t-2 transition-colors"
            [class.border-gray-900]="activeTab === tab.key"
            [class.text-gray-900]="activeTab === tab.key"
            [class.border-transparent]="activeTab !== tab.key"
            [class.text-instagram-gray]="activeTab !== tab.key"
            [ngClass]="{
              'dark:border-gray-100': activeTab === tab.key,
              'dark:text-gray-100': activeTab === tab.key,
              'dark:text-gray-400': activeTab !== tab.key,
            }"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path [attr.d]="tab.icon"></path>
            </svg>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </nav>

      <!-- Posts Grid -->
      <section class="mt-4">
        <div class="grid grid-cols-3 gap-1">
          <div
            *ngFor="let post of posts"
            class="aspect-square bg-gray-300 relative group cursor-pointer"
            [routerLink]="['/post', post.id]"
          >
            <img
              [src]="post.image"
              [alt]="post.caption"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div class="flex items-center space-x-4 text-white">
                <div class="flex items-center space-x-1">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span class="font-semibold">{{ post.likes }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span class="font-semibold">{{ post.comments }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  activeTab = "posts";

  profile = {
    username: "john_doe",
    fullName: "John Doe",
    bio: "Photographer & Travel Enthusiast 📸✈️\nCapturing moments around the world",
    website: "www.johndoe.com",
    postsCount: 42,
    followersCount: 1234,
    followingCount: 567,
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

  posts = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
      likes: 128,
      comments: 24,
      caption: "Beautiful sunset!",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      likes: 89,
      comments: 12,
      caption: "Coffee time",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg",
      likes: 234,
      comments: 45,
      caption: "Mountain hiking",
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      likes: 156,
      comments: 32,
      caption: "City lights",
    },
    {
      id: 5,
      image:
        "https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg",
      likes: 98,
      comments: 18,
      caption: "Beach vibes",
    },
    {
      id: 6,
      image:
        "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg",
      likes: 203,
      comments: 41,
      caption: "Food art",
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log("Profile ID:", params["id"]);
      // Load profile data based on ID
    });
  }
}
