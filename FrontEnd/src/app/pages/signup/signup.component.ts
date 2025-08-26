import { Component, inject } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-lg w-full space-y-6 p-8 bg-white rounded-lg shadow">
        <h2 class="text-3xl font-bold text-center">Sign Up</h2>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">

          <input type="text" formControlName="userName" placeholder="Username" class="input-field" />
          <div *ngIf="signupForm.get('userName')?.invalid && signupForm.get('userName')?.touched" class="text-red-500 text-sm">
            Username is required (min 3 chars)
          </div>

          <input type="text" formControlName="fullName" placeholder="Full Name" class="input-field" />
          <div *ngIf="signupForm.get('fullName')?.invalid && signupForm.get('fullName')?.touched" class="text-red-500 text-sm">
            Full Name is required (min 3 chars)
          </div>

          <input type="email" formControlName="email" placeholder="Email" class="input-field" />
          <div *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched" class="text-red-500 text-sm">
            Valid email is required
          </div>

          <input type="password" formControlName="password" placeholder="Password" class="input-field" />
          <div *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched" class="text-red-500 text-sm">
            Password must be at least 6 characters
          </div>

          <input type="password" formControlName="confirmationPassword" placeholder="Confirm Password" class="input-field" />
          <div *ngIf="signupForm.hasError('passwordMismatch') && signupForm.get('confirmationPassword')?.touched" class="text-red-500 text-sm">
            Passwords do not match
          </div>

          <input type="text" formControlName="phoneNumber" placeholder="Phone Number" class="input-field" />
          <div *ngIf="signupForm.get('phoneNumber')?.invalid && signupForm.get('phoneNumber')?.touched" class="text-red-500 text-sm">
            Phone number is required
          </div>

          <!-- Gender -->
          <select formControlName="gender" class="input-field">
            <option value="" disabled>Select Gender</option>
            <option *ngFor="let g of genders" [value]="g">{{ g }}</option>
          </select>

          <!-- Accessability -->
          <select formControlName="accessabilty" class="input-field">
            <option *ngFor="let a of accessOptions" [value]="a">{{ a }}</option>
          </select>

          <textarea formControlName="bio" placeholder="Write your bio..." class="input-field"></textarea>

          <input type="date" formControlName="DOB" class="input-field" />

          <button type="submit" class="w-full btn-primary" [disabled]="signupForm.invalid">Sign Up</button>
        </form>

        <div class="text-center">
          <p class="text-sm">
            Already have an account?
            <a routerLink="/login" class="text-blue-600 font-semibold hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  genders = ["male", "female"];
  accessOptions = ["public", "private"];

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private postApi = inject(AuthService);

  signupForm = this.fb.group(
    {
      userName: ["", [Validators.required, Validators.minLength(3)]],
      fullName: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ["", Validators.required],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      gender: ["", Validators.required],
      accessabilty: ["public", Validators.required],
      bio: [""],
      DOB: ["", Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password")?.value;
    const confirm = control.get("confirmationPassword")?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log("📦 Data to send:", this.signupForm.value);
      this.postApi.addUser(this.signupForm.value).subscribe({
        next: (data) => {
            console.log("✅ Response:", data);
            this.router.navigate(['/verify-code']);
          },
        error: (err) => console.error("❌ Error:", err),
        complete: () => console.log("🎉 Completed"),
      });
    }
  }
}
