import { Routes } from "@angular/router";
import { authGuard } from "./auth-guard";

export const routes: Routes = [
  {
    path: "",
    canActivate : [authGuard],
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
    path: "profile/:id",
    canActivate : [authGuard],
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: "post/",
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
