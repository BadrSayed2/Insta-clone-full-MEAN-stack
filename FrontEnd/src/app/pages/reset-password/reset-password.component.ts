import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { audit } from "rxjs";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full space-y-6 p-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-2">Set new password</h1>
          <p class="text-instagram-gray dark:text-gray-400 text-sm">
            {{ email ? ("For " + email) : (token ? "Using secure link" : "") }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-6">
          <ng-container *ngIf="hasContext; else missing">
            <form class="space-y-4" (ngSubmit)="onSubmit()">
              <div class="space-y-2">
                <label class="block text-sm font-medium">New password</label>
                <div class="relative">
                  <input
                    [type]="show1 ? 'text' : 'password'"
                    name="password"
                    [(ngModel)]="password"
                    class="input-field pr-12"
                    placeholder="Enter new password"
                    required
                    minlength="6"
                    autocomplete="new-password"
                  />
                  <button type="button" class="abs-btn" (click)="show1 = !show1" aria-label="toggle password visibility">
                    {{ show1 ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium">Confirm password</label>
                <div class="relative">
                  <input
                    [type]="show2 ? 'text' : 'password'"
                    name="confirm"
                    [(ngModel)]="confirm"
                    class="input-field pr-12"
                    placeholder="Confirm new password"
                    required
                    minlength="6"
                    autocomplete="new-password"
                  />
                  <button type="button" class="abs-btn" (click)="show2 = !show2" aria-label="toggle confirm visibility">
                    {{ show2 ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <p class="text-xs text-red-600" *ngIf="confirm && !match">Passwords do not match.</p>
              </div>

              <div *ngIf="error" class="text-sm text-red-600">{{ error }}</div>
              <div *ngIf="success" class="text-sm text-green-600">Password reset successfully.</div>

              <button type="submit" class="w-full btn-primary" [disabled]="loading || !canSubmit">
                {{ loading ? 'Resetting…' : 'Reset password' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <a routerLink="/login" class="text-sm text-instagram-blue hover:underline">Back to login</a>
            </div>
          </ng-container>

          <ng-template #missing>
            <div class="text-center space-y-3">
              <p class="text-sm text-red-500">Missing reset context. Open this page from your email link or provide email and code.</p>
              <a routerLink="/forgot-password" class="text-instagram-blue font-semibold hover:underline">Forgot password</a>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .abs-btn { position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); font-size:0.75rem; color:var(--color-blue, #3897f0); }
    `,
  ],
})
export class ResetPasswordComponent {
  private reseatApi = inject(AuthService);

  email = "";
  code = "";
  token = "";
  password = "";
  confirm = "";
  loading = false;
  success = false;
  error = "";
  show1 = false;
  show2 = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    const qp = this.route.snapshot.queryParamMap;
    this.email = qp.get("email") ?? "";
    this.code = qp.get("code") ?? "";
    this.token = qp.get("token") ?? "";
  }

  get hasContext() {
    return !!(this.token || (this.email && this.code));
  }

  get match() {
    return this.password && this.password === this.confirm;
  }

  get canSubmit() {
    return this.password.length >= 6 && this.match && this.hasContext;
  }

  onSubmit() {
    if (!this.canSubmit) return;
    this.loading = true;
    this.error = "";
    this.success = false;

    this.reseatApi
      .resetPassword(this.token,  this.password )
      .subscribe({
        next: (res: any) => {
          console.log("Reset password success:", res);
          this.success = true;
          setTimeout(() => this.router.navigate(["/login"]), 1000);
        },
        error: (err: any) => {
          console.error("Reset password failed:", err);
          this.error = err?.error?.message || "Failed to reset password";
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
