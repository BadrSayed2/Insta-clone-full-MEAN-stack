import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  CommentComponent,
  Comment,
} from "../../components/comment/comment.component";
import { PostService } from "app/services/post-service";
import { formatDistanceToNow } from "date-fns";
import { CommentService } from "app/services/comment-service";

@Component({
  selector: "app-post-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CommentComponent],
  templateUrl: "post-detail.component.html",
})
export class PostDetailComponent implements OnInit {
  isLiked = false;
  newComment = "";

  post = {
    id: 1,
    username: "john_doe",
    avatar: "",
    image: "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
    caption: "Beautiful sunset at the beach! 🌅 #sunset #beach #photography",
    likes: 128,
    timestamp: "2 hours ago",
  };

  comments: Comment[] = [
    {
      id: 1,
      username: "jane_smith",
      avatar: "",
      text: "Absolutely stunning! 😍",
      timestamp: "1h",
      likes: 12,
    },
    {
      id: 2,
      username: "mike_jones",
      avatar: "",
      text: "Great shot! What camera did you use?",
      timestamp: "45m",
      likes: 8,
    },
    {
      id: 3,
      username: "sarah_wilson",
      avatar: "",
      text: "This is amazing! I need to visit this place",
      timestamp: "30m",
      likes: 15,
    },
    {
      id: 4,
      username: "alex_brown",
      avatar: "",
      text: "Perfect timing for this shot! 📸",
      timestamp: "15m",
      likes: 6,
    },
  ];

  constructor(private route: ActivatedRoute, private postService: PostService
    , private commentService: CommentService) { }

  ngOnInit() {
    this.postService.get_selectedPost().subscribe((res) => {
      const post = res.data
      this.post = {
        id: post._id,
        username: post.user.userName,
        avatar: post.user.picture_url,
        image: post.media.url,
        caption: post.caption,
        likes: 1000,
        timestamp: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

      }
    })

    this.commentService.get_comments(this.postService.get_selected_post_id())
      .subscribe((res: any) => {
        const comments: any = res?.data?.comments
        this.comments = comments.map((comment:any) => {
          return {
            id : comment._id,
            username : comment.user.userName,
            avatar : comment.user.picture_url,
            text : comment.content,
            timestamp : formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }),
            likes : 1000
          }
        })
      })

  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.post.likes++;
    } else {
      this.post.likes--;
    }
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment: Comment = {
        id: this.comments.length + 1,
        username: "current_user",
        avatar: "",
        text: this.newComment.trim(),
        timestamp: "now",
        likes: 0,
      };
      this.comments.push(comment);
      this.newComment = "";
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.addComment();
    }
  }
}
