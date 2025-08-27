import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md w-full space-y-8 p-8">

        <!-- Logo -->
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Instagram</h1>
        </div>

        <!-- Login Form -->
        <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">

            <!-- Email -->
            <div>
              <input
                type="text"
                formControlName="email"
                placeholder="Phone number, username, or email"
                class="input-field"
              />
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="text-red-500 text-sm mt-1">
                <div *ngFor="let err of getErrors('email')">{{ err }}</div>
              </div>
            </div>

            <!-- Password -->
            <div>
              <input
                type="password"
                formControlName="password"
                placeholder="Password"
                class="input-field"
              />
              <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="text-red-500 text-sm mt-1">
                <div *ngFor="let err of getErrors('password')">{{ err }}</div>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50" [disabled]="loginForm.invalid">
              Log In
            </button>
          </form>

          <!-- OR Divider -->
          <div class="flex items-center my-6">
            <div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            <span class="px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <!-- Login with Facebook -->
          <button class="w-full flex items-center justify-center space-x-2 text-blue-600 font-semibold">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span>Log in with Facebook</span>
          </button>

          <div class="text-center mt-4">
            <a routerLink="/forgot-password" class="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm">
            Don't have an account?
            <a routerLink="/signup" class="text-blue-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private loginApi = inject(AuthService);
    private router = inject(Router);


  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  get email() {
    return this.loginForm.get("email");
  }
  get password() {
    return this.loginForm.get("password");
  }

  getErrors(controlName: string): string[] {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors) return [];

    const errors: string[] = [];
    if (control.errors["required"]) errors.push(`${controlName} is required`);
    if (control.errors["email"]) errors.push("Enter a valid email");
    if (control.errors["minlength"])
      errors.push(`${controlName} must be at least ${control.errors["minlength"].requiredLength} characters`);

    return errors;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loginApi.loginUser(this.loginForm.value).subscribe({
      next: (res: any) => {
        alert("Login successful.");
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 403) {
          alert("Please verify your email before logging in.");
          this.router.navigate(['/verify-code']);
        } else if (err.status === 400) {
          alert("Invalid email or password.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      }
    });
  }

}
