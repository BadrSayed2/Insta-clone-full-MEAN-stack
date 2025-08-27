import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../services/theme.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  // host: { "(document:keydown.escape)": "closeSearchPanel()" },
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  // Populated from GET /users/me
  currentUsername = "me";
  avatarUrl: string | null | undefined;
  showSearchPanel = false;
  query = "";
  isDark = false;
  results = [
    { username: "john_doe", name: "John Doe" },
    { username: "jane_smith", name: "Jane Smith" },
    { username: "mike_jones", name: "Mike Jones" },
    { username: "sarah_wilson", name: "Sarah Wilson" },
    { username: "alex_brown", name: "Alex Brown" },
  ];
  recent = [
    { username: "design_daily", name: "Design Daily" },
    { username: "tech_news", name: "Tech News" },
  ];

  filteredResults = this.results;

  toggleSearchPanel() {
    this.showSearchPanel = !this.showSearchPanel;
  }

  closeSearchPanel() {
    this.showSearchPanel = false;
  }

  onQueryChange() {
    const q = this.query.trim().toLowerCase();
    this.filteredResults = q
      ? this.results.filter(
          (r) =>
            r.username.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q)
        )
      : [];
  }

  clearQuery() {
    this.query = "";
    this.filteredResults = [];
  }

  selectRecent(r: { username: string; name: string }) {
    this.query = r.username;
    this.onQueryChange();
  }

  constructor(private theme: ThemeService, private userService: UserService) {
    // initialize from current resolved theme
    this.isDark = this.theme.resolved() === "dark";
  }

  toggleTheme() {
    this.theme.toggle();
    this.isDark = this.theme.resolved() === "dark";
  }

  ngOnInit(): void {
    // Load the logged-in user's profile to display avatar and username in the sidebar
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        // Backend returns { userName, profile_pic, ... }
        this.currentUsername = profile?.userName || this.currentUsername;
        this.avatarUrl = profile?.profile_pic || undefined;
      },
      error: () => {
        // Keep defaults if not authenticated or request fails
        this.avatarUrl = undefined;
      },
    });
  }
}
