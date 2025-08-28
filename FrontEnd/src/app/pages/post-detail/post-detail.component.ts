import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
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
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: "post-detail.component.html",
})
export class PostDetailComponent implements OnInit {
  isLiked = false;
  newComment = "";

  post = {
    id: "091348ldfhsldkj",
    username: "john_doe",
    avatar: "",
    image: "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
    caption: "Beautiful sunset at the beach! 🌅 #sunset #beach #photography",
    likes: 128,
    timestamp: "2 hours ago",
  };

  comments: Comment[] = [];

  constructor(private route: ActivatedRoute, private postService: PostService
    , private commentService: CommentService, private router: Router) { }

  ngOnInit() {
    this.postService.select_post(this.route.snapshot.paramMap.get('id'))
    this.postService.get_selectedPost().subscribe((res) => {

      const post = res.data
      this.post = {
        id: post._id,
        username: post.userId.userName,
        avatar: post.userId.picture_url,
        image: post.media.url,
        caption: post.caption,
        likes: 1000,
        timestamp: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

      }
    })

    this.commentService.get_comments(this.postService.get_selected_post_id())
      .subscribe((res: any) => {
        console.log(res);

        const comments: any = res?.comments
        this.comments = comments.map((comment: any) => {
          return {
            id: comment._id,
            username: comment.userId.userName,
            avatar: comment.userId.picture_url,
            text: comment.content,
            timestamp: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }),
            likes: 1000
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
      this.commentService.add_comment(this.postService.get_selected_post_id()
        , this.newComment.trim()).subscribe((res: any) => {
          console.log(res);

          const is_success = res?.data;
          if (is_success) {
            this.comments.push(comment);
            this.newComment = "";
          }
        })
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.addComment();
    }
  }
}
