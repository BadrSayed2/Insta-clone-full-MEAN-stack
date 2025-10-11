import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav
      class="bg-white dark:bg-gray-900 border-b border-instagram-border dark:border-gray-800 sticky top-0 z-50"
    >
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold">Instagram</a>
          </div>

          <!-- Navigation Icons -->
          <div class="flex items-center space-x-6">
            <a routerLink="/" class="hover:opacity-70 transition-opacity">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </a>
            <a
              routerLink="/messages"
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
            <a
              routerLink="/explore"
              class="hover:opacity-70 transition-opacity"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 9l-2 6-6 2 2-6 6-2z"
                ></path>
              </svg>
            </a>
            <a
              [routerLink]="['/profile', currentUsername]"
              class="hover:opacity-70 transition-opacity"
            >
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
            </a>
            <div class="relative">
              <button
                (click)="toggleMenu()"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
              @if (showMenu) {
              <div
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-instagram-border dark:border-gray-800 py-2"
              >
                <button
                  (click)="toggleTheme()"
                  class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Toggle Dark Mode
                </button>
                <a
                  routerLink="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >Settings</a
                >
                <a
                  routerLink="/login"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >Login</a
                >
                <a
                  routerLink="/signup"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >Sign Up</a
                >
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  showMenu = false;
  currentUsername = "me";

  constructor(private router: Router, private theme: ThemeService) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
