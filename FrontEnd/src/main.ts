import { Component, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { Router, RouterOutlet } from "@angular/router";
import { routes } from "./app/app.routes";
import { SidebarComponent } from "./app/components/sidebar/sidebar.component";
import { NgIf } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NgIf],
  template: `
    <div
      class="min-h-screen bg-instagram-bg dark:bg-gray-900 dark:text-gray-100"
    >
      <div class="max-w-7xl w-full mx-auto px-4 flex gap-6">
        <app-sidebar *ngIf="showSidebar"></app-sidebar>
        <main class="flex-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class App {
  name = "Instagram Clone";

  private hideOn = new Set([
    "/login",
    "/signup",
    "/verify-code",
    "/forgot-password",
  ]);
  constructor(private router: Router) {}
  get showSidebar() {
    const url = this.router.url.split("?")[0];
    return !this.hideOn.has(url);
  }
}

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideRouter(routes)],
});
