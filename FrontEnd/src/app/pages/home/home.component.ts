import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PostCardComponent} from "../../components/post-card/post-card.component";
import { Post } from "app/interfaces/post";
import { PostService } from "app/services/post-service";
import { formatDistanceToNow } from 'date-fns';
import { Router } from "@angular/router";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(private postService: PostService , private router : Router) { }

  ngOnInit(): void {
    this.postService.get_posts().subscribe((data: any) => {
      console.log(data);
      const posts_data = data?.data;
      this.posts  = posts_data.map((post: any) => {
        return {
          id : post._id,
          username :post.user.userName,
          avatar :post.user.profile_pic,
          image :post.media.url,
          caption : post.caption,
          likes : 1000,
          comments : post.commentsNumber,
          timestamp : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
        }
      })
    })
  }
  
  show_post(post_id : string){
    this.postService.select_post(post_id)
    this.router.navigate(['/post/'])
  }
  stories = [
    { username: "john_doe", avatar: "" },
    { username: "jane_smith", avatar: "" },
    { username: "mike_jones", avatar: "" },
    { username: "sarah_wilson", avatar: "" },
    { username: "alex_brown", avatar: "" },
  ];

  posts: Post[] = []

  suggestions = [
    { username: "travel_buddy", mutualFriends: 12 },
    { username: "foodie_life", mutualFriends: 8 },
    { username: "fitness_guru", mutualFriends: 15 },
  ];
}
