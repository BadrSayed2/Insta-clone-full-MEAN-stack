import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  host: { "(document:keydown.escape)": "closeSearchPanel()" },
  template: `
    <aside
      class="block w-20 sm:w-24 lg:w-64 bg-white dark:bg-gray-900 border-r border-instagram-border dark:border-gray-800 h-screen sticky top-0 transition-[width] duration-200 ease-out"
      [ngClass]="{ 'w-[85vw] sm:w-[22rem] lg:w-[28rem]': showSearchPanel }"
    >
      <div class="p-4" *ngIf="!showSearchPanel">
        <nav class="space-y-2">
          <a
            routerLink="/"
            routerLinkActive="active-nav text-instagram-blue"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link justify-center lg:justify-start"
          >
            <svg
              class="w-7 h-7 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            <span class="hidden lg:inline">Home</span>
          </a>
          <button
            type="button"
            (click)="toggleSearchPanel()"
            class="nav-link w-full justify-center lg:justify-start"
            [ngClass]="{ 'active-nav text-instagram-blue': showSearchPanel }"
            [attr.aria-expanded]="showSearchPanel"
            aria-controls="sidebar-search"
          >
            <svg
              class="w-7 h-7 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <span class="hidden lg:inline">Search</span>
          </button>
          <a
            routerLink="/create-post"
            routerLinkActive="active-nav text-instagram-blue"
            class="nav-link justify-center lg:justify-start"
          >
            <svg
              class="w-7 h-7 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span class="hidden lg:inline">Add Post</span>
          </a>
          <a
            routerLink="/explore"
            routerLinkActive="active-nav text-instagram-blue"
            class="nav-link justify-center lg:justify-start"
          >
            <svg
              class="w-7 h-7 lg:w-6 lg:h-6"
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
            <span class="hidden lg:inline">Explore</span>
          </a>
          <a
            routerLink="/messages"
            routerLinkActive="active-nav text-instagram-blue"
            class="nav-link justify-center lg:justify-start"
          >
            <svg
              class="w-7 h-7 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span class="hidden lg:inline">Messages</span>
          </a>
          <a
            routerLink="/profile/1"
            routerLinkActive="active-nav text-instagram-blue"
            #profileActive="routerLinkActive"
            class="nav-link justify-center lg:justify-start"
          >
            <div
              class="w-7 h-7 lg:w-6 lg:h-6 bg-gray-300 rounded-full"
              [ngClass]="{
                'ring-2 ring-instagram-blue':
                  profileActive && profileActive.isActive,
              }"
            ></div>
            <span class="hidden lg:inline">Profile</span>
          </a>
          <a
            routerLink="/settings"
            routerLinkActive="active-nav text-instagram-blue"
            class="nav-link justify-center lg:justify-start"
          >
            <svg
              class="w-7 h-7 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <span class="hidden lg:inline">Settings</span>
          </a>

          <!-- Toggle Dark Mode -->
          <button
            type="button"
            (click)="toggleTheme()"
            class="nav-link w-full justify-center lg:justify-start"
            [attr.aria-pressed]="isDark"
            [title]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <ng-container *ngIf="isDark; else sunIcon">
              <!-- Moon (solid) when dark mode is active -->
              <svg
                class="w-7 h-7 lg:w-6 lg:h-6 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            </ng-container>
            <ng-template #sunIcon>
              <!-- Sun (outline) when light mode is active -->
              <svg
                class="w-7 h-7 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </ng-template>
            <span class="hidden lg:inline">Toggle Dark Mode</span>
          </button>
        </nav>
      </div>
      <div
        class="h-full flex flex-col"
        *ngIf="showSearchPanel"
        id="sidebar-search"
      >
        <div
          class="p-4 border-b border-instagram-border dark:border-gray-800 flex items-center justify-between"
        >
          <h2 class="text-xl font-bold">Search</h2>
          <button
            class="text-sm text-instagram-gray"
            (click)="closeSearchPanel()"
          >
            Close
          </button>
        </div>
        <div class="p-4">
          <div
            class="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2"
          >
            <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              [(ngModel)]="query"
              (input)="onQueryChange()"
              placeholder="Search"
              class="flex-1 bg-transparent outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400"
              autofocus
            />
            <button
              type="button"
              (click)="clearQuery()"
              class="text-xs text-instagram-blue font-semibold"
              *ngIf="query"
            >
              Clear
            </button>
          </div>
        </div>
        <div class="px-4 pb-4 overflow-y-auto flex-1">
          <ng-container
            *ngIf="(filteredResults?.length || 0) > 0; else emptyInline"
          >
            <ul class="divide-y divide-instagram-border dark:divide-gray-800">
              <li
                *ngFor="let r of filteredResults"
                class="py-3 flex items-center gap-3"
              >
                <div class="w-10 h-10 rounded-full bg-gray-300"></div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">{{ r.username }}</p>
                  <p class="text-xs text-instagram-gray truncate">
                    {{ r.name }}
                  </p>
                </div>
                <button class="ml-auto btn-secondary px-3 py-1 text-xs">
                  View
                </button>
              </li>
            </ul>
          </ng-container>
          <ng-template #emptyInline>
            <div class="text-sm text-instagram-gray">
              Try searching for people or topics.
            </div>
            <div class="mt-4">
              <p class="text-xs uppercase text-instagram-gray mb-2">Recent</p>
              <div class="space-y-2">
                <button
                  *ngFor="let r of recent"
                  (click)="selectRecent(r)"
                  class="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span class="font-medium">{{ r.username }}</span>
                  <span class="text-instagram-gray text-xs ml-2">{{
                    r.name
                  }}</span>
                </button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  showSearchPanel = false;
  query = "";
  isDark = false;
  results = [
    { username: "john_doe", name: "John Doe" },
    { username: "jane_smith", name: "Jane Smith" },
    { username: "mike_jones", name: "Mike Jones" },
    { username: "sarah_wilson", name: "Sarah Wilson" },
    { username: "alex_brown", name: "Alex Brown" },
  ];
  recent = [
    { username: "design_daily", name: "Design Daily" },
    { username: "tech_news", name: "Tech News" },
  ];

  filteredResults = this.results;

  toggleSearchPanel() {
    this.showSearchPanel = !this.showSearchPanel;
  }

  closeSearchPanel() {
    this.showSearchPanel = false;
  }

  onQueryChange() {
    const q = this.query.trim().toLowerCase();
    this.filteredResults = q
      ? this.results.filter(
          (r) =>
            r.username.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q)
        )
      : [];
  }

  clearQuery() {
    this.query = "";
    this.filteredResults = [];
  }

  selectRecent(r: { username: string; name: string }) {
    this.query = r.username;
    this.onQueryChange();
  }

  constructor(private theme: ThemeService) {
    // initialize from current resolved theme
    this.isDark = this.theme.resolved() === "dark";
  }

  toggleTheme() {
    this.theme.toggle();
    this.isDark = this.theme.resolved() === "dark";
  }
}
