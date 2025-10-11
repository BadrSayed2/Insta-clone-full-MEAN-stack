import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-explore",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4">
      <h1 class="text-2xl font-semibold mb-6">Explore</h1>

      <!-- Grid Layout -->
      <div class="grid grid-cols-3 gap-1">
        <div
          *ngFor="let post of posts; let i = index"
          class="relative group cursor-pointer"
          [class.row-span-2]="i % 7 === 0"
          [class.col-span-2]="i % 7 === 0"
          [class.aspect-square]="i % 7 !== 0"
          [routerLink]="['/post', post.id]"
        >
          <img
            [src]="post.image"
            [alt]="post.caption"
            class="w-full h-full object-cover"
            [ngClass]="{ 'aspect-[2/1]': i % 7 === 0 }"
          />

          <!-- Overlay on hover -->
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div class="flex items-center space-x-6 text-white">
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span class="font-semibold">{{ post.likes }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span class="font-semibold">{{ post.comments }}</span>
              </div>
            </div>
          </div>

          <!-- Multiple photos indicator -->
          <div *ngIf="post.hasMultiple" class="absolute top-2 right-2">
            <svg
              class="w-5 h-5 text-white drop-shadow-md"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM6 8h8V6H6v2z"
              />
              <path
                d="M6 10a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8zM8 18h8v-8H8v8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExploreComponent {
  posts = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
      likes: 1234,
      comments: 89,
      caption: "Sunset",
      hasMultiple: false,
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      likes: 856,
      comments: 42,
      caption: "Coffee",
      hasMultiple: true,
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg",
      likes: 2341,
      comments: 156,
      caption: "Mountains",
      hasMultiple: false,
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      likes: 567,
      comments: 34,
      caption: "City",
      hasMultiple: false,
    },
    {
      id: 5,
      image:
        "https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg",
      likes: 892,
      comments: 67,
      caption: "Beach",
      hasMultiple: true,
    },
    {
      id: 6,
      image:
        "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg",
      likes: 1456,
      comments: 98,
      caption: "Food",
      hasMultiple: false,
    },
    {
      id: 7,
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
      likes: 723,
      comments: 45,
      caption: "Nature",
      hasMultiple: false,
    },
    {
      id: 8,
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      likes: 1089,
      comments: 78,
      caption: "Architecture",
      hasMultiple: true,
    },
    {
      id: 9,
      image:
        "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
      likes: 654,
      comments: 23,
      caption: "Travel",
      hasMultiple: false,
    },
    {
      id: 10,
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      likes: 987,
      comments: 56,
      caption: "Lifestyle",
      hasMultiple: false,
    },
    {
      id: 11,
      image:
        "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg",
      likes: 1789,
      comments: 134,
      caption: "Adventure",
      hasMultiple: true,
    },
    {
      id: 12,
      image:
        "https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg",
      likes: 456,
      comments: 28,
      caption: "Ocean",
      hasMultiple: false,
    },
    {
      id: 13,
      image:
        "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg",
      likes: 1234,
      comments: 89,
      caption: "Culinary",
      hasMultiple: false,
    },
    {
      id: 14,
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
      likes: 876,
      comments: 54,
      caption: "Forest",
      hasMultiple: true,
    },
    {
      id: 15,
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      likes: 567,
      comments: 32,
      caption: "Urban",
      hasMultiple: false,
    },
  ];
}
