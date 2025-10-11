import { Injectable } from "@angular/core";

type Theme = "light" | "dark" | "system";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private storageKey = "theme";

  constructor() {
    this.apply(this.get());
  }

  get(): Theme {
    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    return stored ?? "system";
  }

  set(theme: Theme) {
    localStorage.setItem(this.storageKey, theme);
    this.apply(theme);
  }

  toggle() {
    const current = this.resolved();
    const next: Theme = current === "dark" ? "light" : "dark";
    this.set(next);
  }

  resolved(): "light" | "dark" {
    const pref = this.get();
    if (pref === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      return mq.matches ? "dark" : "light";
    }
    return pref;
  }

  private apply(theme: Theme) {
    const html = document.documentElement; // <html>
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    html.classList.toggle("dark", isDark);
  }
}
