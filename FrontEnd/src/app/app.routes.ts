import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "signup",
    loadComponent: () =>
      import("./pages/signup/signup.component").then((m) => m.SignupComponent),
  },
  {
    path: "verify-code",
    loadComponent: () =>
      import("./pages/verify-code/verify-code.component").then(
        (m) => m.VerifyCodeComponent
      ),
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("./pages/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./pages/reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: "profile/:id",
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: "post/:id",
    loadComponent: () =>
      import("./pages/post-detail/post-detail.component").then(
        (m) => m.PostDetailComponent
      ),
  },
  {
    path: "explore",
    loadComponent: () =>
      import("./pages/explore/explore.component").then(
        (m) => m.ExploreComponent
      ),
  },
  {
    path: "messages",
    loadComponent: () =>
      import("./pages/messages/messages.component").then(
        (m) => m.MessagesComponent
      ),
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./pages/settings/settings.component").then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
