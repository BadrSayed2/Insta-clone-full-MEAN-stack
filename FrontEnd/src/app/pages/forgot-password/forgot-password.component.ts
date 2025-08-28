import { Component, inject, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";

import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full space-y-6 p-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-2">Trouble logging in?</h1>
          <p class="text-instagram-gray dark:text-gray-400 text-sm">
            Enter your email and we'll send you a link to get back into your
            account.
          </p>
        </div>

        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-6"
        >

          @if (!sent) {
          <form class="space-y-4" (ngSubmit)="send()">
            <div>
              <input
                type="email"
                name="email"
                [(ngModel)]="email"
                placeholder="Email"
                class="input-field"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full btn-primary"
              [disabled]="loading"
            >
              {{ loading ? "Sending…" : "Send login link" }}
            </button>
          </form>


          <div class="text-center mt-4">
            <a
              routerLink="/login"
              class="text-sm text-instagram-blue hover:underline"
              >Back to login</a
            >
          </div>
          } @else {
          <div class="text-center space-y-3">
            <div
              class="w-14 h-14 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <svg
                class="w-7 h-7 text-green-600 dark:text-green-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 12l2 2 4-4 1.5 1.5L11 16l-3.5-3.5L9 12z" />
              </svg>
            </div>
            <h2 class="text-lg font-semibold">Check your email</h2>
            <p class="text-instagram-gray dark:text-gray-400 text-sm">
              We sent a login link to
              <span class="font-medium">{{ email }}</span
              >.
            </p>
            <div>
              <a
                routerLink="/login"
                class="text-instagram-blue font-semibold hover:underline"
                >Back to login</a
              >
            </div>
          </div>
          }
        </div>

        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-4 text-center"
        >
          <p class="text-sm">
            Don’t have an account?
            <a
              routerLink="/signup"
              class="text-instagram-blue font-semibold hover:underline"
              >Sign up</a
            >
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
private postApi = inject (AuthService);

email: string = "";
sent: boolean = false;
loading: boolean = false;

send() {
  if (!this.email) {
    alert("Please enter your email first.");
    return;
  }

  this.loading = true;

this.postApi.forgetPassword({ email: this.email }).subscribe({
  next: (res: any) => {
    this.loading = false;
    this.sent = true;
    console.log("Password reset link sent to:", this.email);
    alert("Check your email for the reset link!");
  },
  error: (err: any) => {
    this.loading = false;
    console.error("Error while sending reset link", err);
    alert("Something went wrong, please try again.");
  }
});
}
}