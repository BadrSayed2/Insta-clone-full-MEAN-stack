import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { UserService } from "app/services/user.service";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./settings.component.html",
})
export class SettingsComponent implements OnInit {
  activeSection = "profile";
  loading = false;
  saving = false;
  saveMessage = "";
  profilePicUrl = "";
  profilePicFile: File | null = null;

  settingsSections = [
    {
      key: "profile",
      label: "Edit Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      key: "password",
      label: "Change Password",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      key: "privacy",
      label: "Privacy and Security",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      key: "notifications",
      label: "Push Notifications",
      icon: "M15 17h5l-5-5 5-5m-8 0a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      key: "help",
      label: "Help",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      key: "logout",
      label: "Log Out",
      icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    },
  ];

  profileData = {
    name: "",
    username: "",
    website: "",
    bio: "",
    email: "",
    phone: "",
  };

  passwordData = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  privacySettings = {
    privateAccount: false,
    storySharing: true,
    activityStatus: true,
  };

  notificationSettings = {
    likes: true,
    comments: true,
    followers: true,
    messages: true,
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Load current user's profile like on Profile page
    this.loading = true;
    this.userService.getUserProfile().subscribe({
      next: (p) => {
        this.profileData = {
          name: p.fullName || "",
          username: p.userName || "",
          website: "", // not provided by backend yet
          bio: p.bio || "",
          email: p.email || "",
          phone: (p as any).phoneNumber || "",
        };
        this.profilePicUrl = (p as any).profile_pic || "";
      },
      error: (e: any) => console.error("Failed to load profile in settings", e),
      complete: () => (this.loading = false),
    });
  }

  submitProfile() {
    this.saving = true;
    this.saveMessage = "";
    // Build multipart/form-data so backend can handle optional image at key 'profile'
    const form = new FormData();
    if (this.profilePicFile) {
      form.append("profile", this.profilePicFile);
    }
    if (this.profileData.name) form.append("fullName", this.profileData.name);
    if (this.profileData.username)
      form.append("userName", this.profileData.username);
    if (this.profileData.bio) form.append("bio", this.profileData.bio);
    if (this.profileData.phone)
      form.append("phoneNumber", this.profileData.phone);
    // Note: email is not updated by backend controller; skipped

    this.userService.updateUserProfile(form).subscribe({
      next: (res: any) => {
        this.saveMessage = "Profile updated";
        const updated = res?.user;
        const pic = updated?.profile_pic;
        // Handle string or object shape
        this.profilePicUrl =
          typeof pic === "string" ? pic : pic?.url || this.profilePicUrl;
      },
      error: (e: any) => {
        console.error("Update profile failed", e);
        this.saveMessage = "Update failed";
      },
      complete: () => (this.saving = false),
    });
  }

  onProfileFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    this.profilePicFile = file;
    // Preview selected image
    const reader = new FileReader();
    reader.onload = () => (this.profilePicUrl = reader.result as string);
    reader.readAsDataURL(file);
  }
}
