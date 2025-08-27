import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full space-y-8 p-8">
        <!-- Logo -->
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-8">Instagram</h1>
        </div>

        <!-- Login Form -->
        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-8"
        >
          <form class="space-y-4" (ngSubmit)="onSubmit()">
            <div>
              <input
                type="text"
                [(ngModel)]="formData.username"
                name="username"
                placeholder="Phone number, username, or email"
                class="input-field"
                required
              />
            </div>
            <div>
              <input
                type="password"
                [(ngModel)]="formData.password"
                name="password"
                placeholder="Password"
                class="input-field"
                required
              />
            </div>
            <button type="submit" class="w-full btn-primary">Log In</button>
          </form>

          <div class="flex items-center my-6">
            <div
              class="flex-1 border-t border-instagram-border dark:border-gray-800"
            ></div>
            <span class="px-4 text-sm text-instagram-gray dark:text-gray-400"
              >OR</span
            >
            <div
              class="flex-1 border-t border-instagram-border dark:border-gray-800"
            ></div>
          </div>

          <button
            class="w-full flex items-center justify-center space-x-2 text-instagram-blue font-semibold"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span>Log in with Facebook</span>
          </button>

          <div class="text-center mt-4">
            <a
              routerLink="/forgot-password"
              class="text-sm text-instagram-blue hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-4 text-center"
        >
          <p class="text-sm">
            Don't have an account?
            <a
              routerLink="/signup"
              class="text-instagram-blue font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  formData = {
    username: "",
    password: "",
  };

  constructor(private router: Router) {}

  onSubmit() {
    // TODO: Replace with real login. On success, go to OTP verification.
    const emailOrUser = this.formData.username.trim();
    this.router.navigate(["/verify-code"], {
      queryParams: { email: emailOrUser || undefined, reason: "login" },
    });
  }
}
