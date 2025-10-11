import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

@Component({
  selector: "app-comment",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-start gap-3 py-2">
      <div class="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm leading-snug">
          <span class="font-semibold mr-2">{{ comment.username }}</span>
          <span class="break-words whitespace-pre-wrap">{{
            comment.text
          }}</span>
        </p>
        <div
          class="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-instagram-gray dark:text-gray-400"
        >
          <span>{{ comment.timestamp }}</span>
          <span aria-hidden="true">•</span>
          <span>{{ comment.likes }} likes</span>
          <button
            class="font-semibold hover:text-gray-900 dark:hover:text-white"
          >
            Reply
          </button>
        </div>
      </div>
      <button
        (click)="toggleLike()"
        class="flex-shrink-0 p-1 rounded-full text-instagram-gray dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        [attr.aria-pressed]="isLiked"
        aria-label="Like comment"
      >
        <svg
          class="w-4 h-4"
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
    </div>
  `,
})
export class CommentComponent {
  @Input() comment!: Comment;
  isLiked = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.comment.likes++;
    } else {
      this.comment.likes--;
    }
  }
}
