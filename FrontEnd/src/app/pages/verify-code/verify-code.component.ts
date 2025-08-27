import { Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-verify-code",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full space-y-6 p-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-2">Enter verification code</h1>
          <p class="text-instagram-gray dark:text-gray-400 text-sm">
            {{
              reason === "login"
                ? "Enter the code we sent to"
                : "We sent a 6-digit code to"
            }}
            <span class="font-medium">{{ email || "your email" }}</span
            >.
          </p>
        </div>

        <div
          class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg p-6"
        >
          <form class="space-y-5" (ngSubmit)="verify()">
            <div
              class="flex items-center justify-between gap-2 select-none"
              aria-label="Verification code inputs"
            >
              <input
                *ngFor="let d of boxes; let i = index"
                #box
                [attr.inputmode]="'numeric'"
                [attr.pattern]="'\\d*'"
                maxlength="1"
                class="w-12 h-12 text-center text-xl rounded-md border border-instagram-border dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-instagram-blue"
                [(ngModel)]="digits[i]"
                (input)="onInput(i)"
                (keydown)="onKeydown($event, i)"
                name="code-{{ i }}"
                autocomplete="one-time-code"
              />
            </div>

            <div class="flex items-center justify-between text-sm">
              <button
                type="button"
                class="text-instagram-blue font-semibold hover:underline"
                (click)="resend()"
                [disabled]="resending"
              >
                {{ resending ? "Resending…" : "Resend code" }}
              </button>
              <span class="text-instagram-gray dark:text-gray-400">{{
                message
              }}</span>
            </div>

            <button
              type="submit"
              class="w-full btn-primary"
              [disabled]="loading || code.length !== 6"
            >
              {{ loading ? "Verifying…" : "Verify" }}
            </button>
          </form>

          <div class="text-center mt-4">
            <a
              routerLink="/login"
              class="text-sm text-instagram-blue hover:underline"
              >Back to login</a
            >
          </div>
        </div>
      </div>
    </div>
  `,
})
export class VerifyCodeComponent {
  email = "";
  reason: string | null = null;
  boxes = Array(6).fill(0);
  digits: string[] = Array(6).fill("");
  loading = false;
  resending = false;
  message = "";

  @ViewChildren("box") inputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private route: ActivatedRoute, private router: Router) {
    const qp = this.route.snapshot.queryParamMap;
    this.email = qp.get("email") ?? "";
    this.reason = qp.get("reason");
  }

  get code() {
    return this.digits.join("");
  }

  onInput(i: number) {
    // Sanitize to digit
    const v = this.digits[i]?.replace(/\D/g, "") ?? "";
    this.digits[i] = v.slice(0, 1);
    if (v && i < this.boxes.length - 1) {
      const next = this.inputs.get(i + 1)?.nativeElement;
      next?.focus();
    }
  }

  onKeydown(e: KeyboardEvent, i: number) {
    if (e.key === "Backspace" && !this.digits[i] && i > 0) {
      const prev = this.inputs.get(i - 1)?.nativeElement;
      prev?.focus();
    } else if (/^\d$/.test(e.key)) {
      // allow digit; will be handled by onInput
    } else if (
      e.key.length === 1 &&
      !/^\d$/.test(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
  }

  async resend() {
    this.resending = true;
    this.message = "";
    try {
      await new Promise((r) => setTimeout(r, 700));
      this.message = "Code resent.";
    } finally {
      this.resending = false;
    }
  }

  async verify() {
    if (this.code.length !== 6) return;
    this.loading = true;
    this.message = "";
    try {
      // TODO: call backend verification with this.email and this.code
      await new Promise((r) => setTimeout(r, 800));
      // On success, redirect (e.g., to reset password page)
      this.router.navigate(["/login"]);
    } finally {
      this.loading = false;
    }
  }
}
