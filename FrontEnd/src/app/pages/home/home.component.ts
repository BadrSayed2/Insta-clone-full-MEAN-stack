import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  PostCardComponent,
  Post,
} from "../../components/post-card/post-card.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  template: `
    <div class="flex">
      <main class="flex-1 max-w-2xl mx-auto py-8 px-4">
        <!-- Stories Section -->
        <section
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-4 mb-6"
        >
          <h2 class="font-semibold text-sm mb-3 text-instagram-gray">
            Stories
          </h2>
          <div class="flex space-x-4 overflow-x-auto no-scrollbar">
            <div
              *ngFor="let story of stories"
              class="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 p-1"
              >
                <div class="w-full h-full bg-gray-300 rounded-full"></div>
              </div>
              <span class="text-xs text-center max-w-16 truncate">{{
                story.username
              }}</span>
            </div>
          </div>
        </section>

        <!-- Posts Feed -->
        <section>
          <app-post-card
            *ngFor="let post of posts"
            [post]="post"
          ></app-post-card>
        </section>
      </main>

      <!-- Suggestions Sidebar -->
      <aside class="hidden xl:block w-80 py-8 px-4">
        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-4"
        >
          <h2 class="font-semibold text-sm mb-4 text-instagram-gray">
            Suggestions For You
          </h2>
          <div class="space-y-3">
            <div
              *ngFor="let suggestion of suggestions"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p class="font-semibold text-sm">{{ suggestion.username }}</p>
                  <p class="text-instagram-gray text-xs">
                    {{ suggestion.mutualFriends }} mutual friends
                  </p>
                </div>
              </div>
              <button
                class="text-instagram-blue text-sm font-semibold hover:text-blue-600"
              >
                Follow
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
})
export class HomeComponent {
  stories = [
    { username: "john_doe", avatar: "" },
    { username: "jane_smith", avatar: "" },
    { username: "mike_jones", avatar: "" },
    { username: "sarah_wilson", avatar: "" },
    { username: "alex_brown", avatar: "" },
  ];

  posts: Post[] = [
    {
      id: 1,
      username: "john_doe",
      avatar: "",
      image:
        "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
      caption: "Beautiful sunset at the beach! 🌅",
      likes: 128,
      comments: 24,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      username: "jane_smith",
      avatar: "",
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      caption: "Coffee and code ☕️ #developer #coding",
      likes: 89,
      comments: 12,
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      username: "mike_jones",
      avatar: "",
      image:
        "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg",
      caption: "Weekend hiking adventure! Nature is amazing 🏔️",
      likes: 234,
      comments: 45,
      timestamp: "1 day ago",
    },
  ];

  suggestions = [
    { username: "travel_buddy", mutualFriends: 12 },
    { username: "foodie_life", mutualFriends: 8 },
    { username: "fitness_guru", mutualFriends: 15 },
  ];
}
