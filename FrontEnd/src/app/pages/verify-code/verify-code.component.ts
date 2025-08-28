import { Component, ElementRef, QueryList, ViewChildren, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-verify-code",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md w-full space-y-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Enter verification code</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            We sent an 8-digit code to <span class="font-medium">{{ email || 'your email' }}</span>.
          </p>
        </div>

        <form (ngSubmit)="verify()" class="space-y-6">
          <div class="flex justify-between gap-3">
            <input
              *ngFor="let d of boxes; let i = index"
              #box
              maxlength="1"
              type="text"
              inputmode="numeric"
              pattern="\\d*"
              class="w-12 h-12 text-center text-xl rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              [(ngModel)]="digits[i]"
              name="digit-{{ i }}"
              autocomplete="one-time-code"
              (input)="onInput(i)"
              (keydown)="onKeydown($event, i)"
            />
          </div>

          <div class="flex justify-between items-center text-sm">
            <button
              type="button"
              class="text-blue-600 font-semibold hover:underline disabled:opacity-50"
              (click)="resend()"
              [disabled]="resending"
            >
              {{ resending ? 'Resending…' : 'Resend code' }}
            </button>
            <span class="text-gray-500 dark:text-gray-400">{{ message }}</span>
          </div>

          <button
            type="submit"
            class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            [disabled]="loading || code.length !== 8"
          >
            {{ loading ? 'Verifying…' : 'Verify' }}
          </button>
        </form>

        <div class="text-center mt-4">
          <a routerLink="/login" class="text-sm text-blue-600 hover:underline">Back to login</a>
        </div>
      </div>
    </div>
  `,
})
export class VerifyCodeComponent {
  email = "";
  boxes = Array(8).fill(0);
  digits: string[] = Array(8).fill("");
  loading = false;
  resending = false;
  message = "";

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  @ViewChildren('box') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor() {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  get code() {
    return this.digits.join("");
  }

  onInput(i: number) {
    const v = this.digits[i]?.replace(/\D/g, '') ?? '';
    this.digits[i] = v.slice(0, 1);
    if (v && i < this.boxes.length - 1) {
      const next = this.inputs.get(i + 1)?.nativeElement;
      next?.focus();
    }
  }

  onKeydown(e: KeyboardEvent, i: number) {
    if (e.key === 'Backspace' && !this.digits[i] && i > 0) {
      const prev = this.inputs.get(i - 1)?.nativeElement;
      prev?.focus();
    } else if (/^\d$/.test(e.key)) {
      // allow digit
    } else if (e.key.length === 1 && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  }

  async resend() {
    this.resending = true;
    this.message = '';
    try {
      await new Promise((r) => setTimeout(r, 700));
      this.message = 'Code resent.';
    } finally {
      this.resending = false;
    }
  }

  verify() {
    if (this.code.length !== 8) return;

    this.loading = true;
    this.message = '';

    this.authService.verify({ code: this.code }).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Verified successfully!';
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.message = err?.error?.message || 'Verification failed';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
