import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4">
      <div
        class="bg-white dark:bg-gray-900 border border-instagram-border dark:border-gray-800 rounded-lg overflow-hidden"
      >
        <div class="flex">
          <!-- Settings Navigation -->
          <nav
            class="w-1/3 border-r border-instagram-border dark:border-gray-800"
          >
            <div
              class="p-4 border-b border-instagram-border dark:border-gray-800"
            >
              <h2 class="text-xl font-semibold">Settings</h2>
            </div>

            <div class="py-2">
              <button
                *ngFor="let section of settingsSections"
                (click)="activeSection = section.key"
                class="w-full text-left px-4 py-3 transition-colors rounded-lg"
                [ngClass]="{
                  'active-nav text-instagram-blue':
                    activeSection === section.key,
                  'hover:bg-gray-50 dark:hover:bg-gray-800':
                    activeSection !== section.key,
                }"
              >
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="section.icon"
                    ></path>
                  </svg>
                  <span class="text-sm">{{ section.label }}</span>
                </div>
              </button>
            </div>
          </nav>

          <!-- Settings Content -->
          <div class="flex-1">
            <!-- Edit Profile -->
            <div *ngIf="activeSection === 'profile'" class="p-6">
              <h3 class="text-xl font-semibold mb-6">Edit Profile</h3>

              <div class="space-y-6">
                <div class="flex items-center space-x-6">
                  <div
                    class="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"
                  ></div>
                  <div>
                    <h4 class="font-semibold">{{ profileData.username }}</h4>
                    <button
                      class="text-instagram-blue text-sm font-semibold hover:text-blue-600"
                    >
                      Change profile photo
                    </button>
                  </div>
                </div>

                <div class="grid gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Name</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="profileData.name"
                      class="input-field"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Username</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="profileData.username"
                      class="input-field"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Website</label
                    >
                    <input
                      type="url"
                      [(ngModel)]="profileData.website"
                      class="input-field"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Bio</label
                    >
                    <textarea
                      [(ngModel)]="profileData.bio"
                      rows="3"
                      class="input-field resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Email</label
                    >
                    <input
                      type="email"
                      [(ngModel)]="profileData.email"
                      class="input-field"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-1"
                      >Phone Number</label
                    >
                    <input
                      type="tel"
                      [(ngModel)]="profileData.phone"
                      class="input-field"
                    />
                  </div>
                </div>

                <button class="btn-primary">Submit</button>
              </div>
            </div>

            <!-- Change Password -->
            <div *ngIf="activeSection === 'password'" class="p-6">
              <h3 class="text-xl font-semibold mb-6">Change Password</h3>

              <div class="max-w-md space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Old Password</label
                  >
                  <input
                    type="password"
                    [(ngModel)]="passwordData.oldPassword"
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >New Password</label
                  >
                  <input
                    type="password"
                    [(ngModel)]="passwordData.newPassword"
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Confirm New Password</label
                  >
                  <input
                    type="password"
                    [(ngModel)]="passwordData.confirmPassword"
                    class="input-field"
                  />
                </div>

                <button class="btn-primary">Change Password</button>
              </div>
            </div>

            <!-- Privacy Settings -->
            <div *ngIf="activeSection === 'privacy'" class="p-6">
              <h3 class="text-xl font-semibold mb-6">Privacy and Security</h3>

              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Private Account</h4>
                    <p class="text-sm text-instagram-gray">
                      When your account is private, only people you approve can
                      see your photos and videos on Instagram.
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="privacySettings.privateAccount"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="privacySettings.privateAccount"
                        [class.bg-instagram-blue]="
                          privacySettings.privateAccount
                        "
                      ></div>
                    </div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Story Sharing</h4>
                    <p class="text-sm text-instagram-gray">
                      Allow others to reshare your story as messages
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="privacySettings.storySharing"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="privacySettings.storySharing"
                        [class.bg-instagram-blue]="privacySettings.storySharing"
                      ></div>
                    </div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Activity Status</h4>
                    <p class="text-sm text-instagram-gray">
                      Allow accounts you follow and anyone you message to see
                      when you were last active
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="privacySettings.activityStatus"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="privacySettings.activityStatus"
                        [class.bg-instagram-blue]="
                          privacySettings.activityStatus
                        "
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <div *ngIf="activeSection === 'notifications'" class="p-6">
              <h3 class="text-xl font-semibold mb-6">Push Notifications</h3>

              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Likes</h4>
                    <p class="text-sm text-instagram-gray">
                      Get notified when someone likes your post
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="notificationSettings.likes"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="notificationSettings.likes"
                        [class.bg-instagram-blue]="notificationSettings.likes"
                      ></div>
                    </div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Comments</h4>
                    <p class="text-sm text-instagram-gray">
                      Get notified when someone comments on your post
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="notificationSettings.comments"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="notificationSettings.comments"
                        [class.bg-instagram-blue]="
                          notificationSettings.comments
                        "
                      ></div>
                    </div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">New Followers</h4>
                    <p class="text-sm text-instagram-gray">
                      Get notified when someone starts following you
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="notificationSettings.followers"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="notificationSettings.followers"
                        [class.bg-instagram-blue]="
                          notificationSettings.followers
                        "
                      ></div>
                    </div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Direct Messages</h4>
                    <p class="text-sm text-instagram-gray">
                      Get notified when you receive a direct message
                    </p>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="notificationSettings.messages"
                      class="sr-only"
                    />
                    <div class="relative">
                      <div
                        class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"
                      ></div>
                      <div
                        class="absolute w-4 h-4 bg-white rounded-full shadow inset-y-1 left-1 transition-transform"
                        [class.translate-x-4]="notificationSettings.messages"
                        [class.bg-instagram-blue]="
                          notificationSettings.messages
                        "
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Help -->
            <div *ngIf="activeSection === 'help'" class="p-6">
              <h3 class="text-xl font-semibold mb-6">Help</h3>

              <div class="space-y-4">
                <a
                  href="#"
                  class="block p-4 border border-instagram-border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h4 class="font-semibold text-sm">Help Center</h4>
                  <p class="text-instagram-gray text-sm">
                    Get answers to frequently asked questions
                  </p>
                </a>

                <a
                  href="#"
                  class="block p-4 border border-instagram-border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h4 class="font-semibold text-sm">Report a Problem</h4>
                  <p class="text-instagram-gray text-sm">
                    Let us know if something isn't working
                  </p>
                </a>

                <a
                  href="#"
                  class="block p-4 border border-instagram-border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h4 class="font-semibold text-sm">Privacy Policy</h4>
                  <p class="text-instagram-gray text-sm">
                    Learn about our privacy practices
                  </p>
                </a>

                <a
                  href="#"
                  class="block p-4 border border-instagram-border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h4 class="font-semibold text-sm">Terms of Use</h4>
                  <p class="text-instagram-gray text-sm">
                    Read our terms and conditions
                  </p>
                </a>
              </div>
            </div>

            <!-- Logout -->
            <div *ngIf="activeSection === 'logout'" class="p-6">
              <h3 class="text-xl font-semibold mb-6">Log Out</h3>

              <div class="max-w-md">
                <p class="text-instagram-gray mb-6">
                  Are you sure you want to log out? You'll need to enter your
                  username and password to log back in.
                </p>

                <div class="flex space-x-4">
                  <button class="btn-secondary">Cancel</button>
                  <a routerLink="/login" class="btn-primary">Log Out</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  activeSection = "profile";

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
    name: "John Doe",
    username: "john_doe",
    website: "https://johndoe.com",
    bio: "Photographer & Travel Enthusiast 📸✈️\nCapturing moments around the world",
    email: "john@example.com",
    phone: "+1 234 567 8900",
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
}
