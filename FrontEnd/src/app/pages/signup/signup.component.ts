import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full space-y-8 p-8">
        <!-- Logo -->
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Instagram</h1>
          <p class="text-instagram-gray text-sm font-semibold mb-8">
            Sign up to see photos and videos from your friends.
          </p>
        </div>

        <!-- Sign Up Form -->
        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-8"
        >
          <button
            class="w-full flex items-center justify-center space-x-2 text-white bg-instagram-blue hover:bg-blue-600 transition-colors py-2 rounded-lg font-semibold mb-4"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span>Log in with Facebook</span>
          </button>

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

          <form class="space-y-4" (ngSubmit)="onSubmit()">
            <div>
              <input
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                placeholder="Email"
                class="input-field"
                required
              />
            </div>
            <div>
              <input
                type="text"
                [(ngModel)]="formData.fullName"
                name="fullName"
                placeholder="Full Name"
                class="input-field"
                required
              />
            </div>
            <div>
              <input
                type="text"
                [(ngModel)]="formData.username"
                name="username"
                placeholder="Username"
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
            <div class="text-xs text-instagram-gray">
              <p class="mb-2">
                People who use our service may have uploaded your contact
                information to Instagram.
                <a href="#" class="text-instagram-blue">Learn More</a>
              </p>
              <p>
                By signing up, you agree to our
                <a href="#" class="text-instagram-blue">Terms</a> ,
                <a href="#" class="text-instagram-blue">Privacy Policy</a> and
                <a href="#" class="text-instagram-blue">Cookies Policy</a>.
              </p>
            </div>
            <button type="submit" class="w-full btn-primary">Sign up</button>
          </form>
        </div>

        <!-- Login Link -->
        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-4 text-center"
        >
          <p class="text-sm">
            Have an account?
            <a
              routerLink="/login"
              class="text-instagram-blue font-semibold hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  formData = {
    email: "",
    fullName: "",
    username: "",
    password: "",
  };

  onSubmit() {
    console.log("Signup attempt:", this.formData);
    // Add signup logic here
  }
}
