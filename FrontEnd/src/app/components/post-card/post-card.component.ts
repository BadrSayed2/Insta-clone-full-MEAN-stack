import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Post } from "app/interfaces/post";

@Component({
  selector: "app-post-card",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <article class="post-card dark:bg-gray-800 dark:border-gray-700">
      <!-- Post Header -->
      <header class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <h3 class="font-semibold text-sm">{{ post.username }}</h3>
            <p class="text-instagram-gray dark:text-gray-400 text-xs">
              {{ post.timestamp }}
            </p>
          </div>
        </div>
        <button
          class="text-instagram-gray dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
      </header>

      <!-- Post Image -->
      <div class="relative">
        <img
          [src]="post.image"
          [alt]="post.caption"
          class="w-full aspect-square object-cover"
          (dblclick)="toggleLike()"
        />
      </div>

      <!-- Post Actions -->
      <div class="p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-4">
            <button
              (click)="toggleLike()"
              class="hover:opacity-70 transition-opacity"
            >
              <svg
                class="w-6 h-6"
                [class.text-red-500]="isLiked"
                [class.fill-current]="isLiked"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </button>
            <a
              [routerLink]="['/post', post.id]"
              class="hover:opacity-70 transition-opacity"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </a>
            <button class="hover:opacity-70 transition-opacity">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </button>
          </div>
          <button class="hover:opacity-70 transition-opacity">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Likes -->
        <div class="mb-2">
          <span class="font-semibold text-sm">{{ post.likes }} likes</span>
        </div>

        <!-- Caption -->
        <div class="mb-2">
          <span class="font-semibold text-sm mr-2">{{ post.username }}</span>
          <span class="text-sm">{{ post.caption }}</span>
        </div>

        <!-- Comments Link -->
        <a
          [routerLink]="['/post', post.id]"
          class="text-instagram-gray dark:text-gray-300 text-sm hover:underline"
        >
          View all {{ post.comments }} comments
        </a>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  @Input() post!: Post;
  isLiked = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.post.likes++;
    } else {
      this.post.likes--;
    }
  }
}
