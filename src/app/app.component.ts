import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';
import { log } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    FormsModule, 
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    UserService, 
    PostService, 
    CommentService
  ]
})
export class AppComponent implements OnInit {
  title = 'Twitter Clone';
  users: any[] = [];
  posts: any[] = [];
  comments: any[] = [];
  selectedUser: number = 1;
  selectedPost: number | null = null;


  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        // Ensure we have a valid user selected
        const defaultUser = users.find(u => u.id === this.selectedUser);
        console.log(defaultUser)
        this.selectedUser = defaultUser.id;
        console.log(this.selectedUser)
        this.loadUserPosts(this.selectedUser);
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  get selectedUserProfile(): any {
    if (this.users.length === 0) return null;
    const userId = Number(this.selectedUser);
    // console.log(this.users)
    console.log("The selected user is: " + this.selectedUser)
    console.log(this.users.find(u => u.id === this.selectedUser))
    return this.users.find(u => u.id === userId) ;
  }

  loadUserPosts(userId: number) {
    this.selectedUser = userId;
    // console.log(this.selectedUser)
    this.postService.getPostsByUser(userId).subscribe({
      next: (posts) => {
        this.posts = posts;
        // Reset comments when loading new posts
        this.comments = [];
        if (posts.length > 0) {
          this.loadPostComments(posts[0].id);
        }
      },
      error: (error) => {
        console.error('Error fetching posts', error);
      }
    });
  }

  loadPostComments(postId: number) {
    this.selectedPost = postId;
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        console.log("I am Fetching comments")
      },
      error: (error) => {
        console.error('Error fetching comments', error);
      }
    });
  }
}