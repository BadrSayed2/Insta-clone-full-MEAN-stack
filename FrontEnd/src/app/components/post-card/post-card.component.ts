import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Post } from "app/interfaces/post";

@Component({
  selector: "app-post-card",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "post-card.component.html"
})
export class PostCardComponent {
  @Input() post!: Post;
  isLiked = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.post.likes++;
    } else {
      this.post.likes--;
    }
  }
}
