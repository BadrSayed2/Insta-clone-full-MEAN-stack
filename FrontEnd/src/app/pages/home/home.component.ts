import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PostCardComponent} from "../../components/post-card/post-card.component";
import { Post } from "app/interfaces/post";
import { PostService } from "app/services/post-service";
import { formatDistanceToNow } from 'date-fns';
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(private postService: PostService) { }

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

  stories = [
    { username: "john_doe", avatar: "" },
    { username: "jane_smith", avatar: "" },
    { username: "mike_jones", avatar: "" },
    { username: "sarah_wilson", avatar: "" },
    { username: "alex_brown", avatar: "" },
  ];

  posts: Post[] = [
    {
      id: 1,
      username: "john_doe",
      avatar: "",
      image:
        "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg",
      caption: "Beautiful sunset at the beach! 🌅",
      likes: 128,
      comments: 24,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      username: "jane_smith",
      avatar: "",
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      caption: "Coffee and code ☕️ #developer #coding",
      likes: 89,
      comments: 12,
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      username: "mike_jones",
      avatar: "",
      image:
        "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg",
      caption: "Weekend hiking adventure! Nature is amazing 🏔️",
      likes: 234,
      comments: 45,
      timestamp: "1 day ago",
    },
  ];

  suggestions = [
    { username: "travel_buddy", mutualFriends: 12 },
    { username: "foodie_life", mutualFriends: 8 },
    { username: "fitness_guru", mutualFriends: 15 },
  ];
}
