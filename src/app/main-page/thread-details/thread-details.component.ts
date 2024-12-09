import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostReplyModel } from 'src/app/models/post-reply.model';
import { PostModel } from 'src/app/models/post.model';
import { ForumThreadModel } from 'src/app/models/thread.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { claimReq } from 'src/app/shared/utils/claimReq-utils';

@Component({
  selector: 'app-thread-details',
  templateUrl: './thread-details.component.html',
  styleUrls: ['./thread-details.component.css' ]
})
export class ThreadDetailsComponent implements OnInit {
  threadId: number = 0;
  thread: ForumThreadModel = new ForumThreadModel;
  posts: PostModel[] = [];
  replies: { [key: number]: PostReplyModel[] } = {};

  editingPostId: number | null = null;
  editContent: string = '';

  replyingPostId: number | null = null;
  replyContent: string = '';
  editingReplyId: number | null = null;
  editReplyContent: string = '';

  currentUser: string | null = null;
  claimReq = claimReq;

  pageSize = 10;
  pageNumber = 1;
  postsCount = 0;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private threadService: ThreadService,
    public postService: PostService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.threadId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.currentUser = this.authService.getUserName();
    this.loadThread();
    this.loadPosts();
  }

  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPosts();
  }

  loadThread() {
    this.threadService.getThread(this.threadId).subscribe({
      next: (thread) => (this.thread = thread),
      error: (err) => console.log(err),
    });
  }

  //Posts

  loadPosts() {
    this.postService.getPostsByThreadId(this.threadId, this.pageNumber, this.pageSize)
    .subscribe({
      next: (postsObject) => {
        this.posts = postsObject.posts;
        this.postsCount = postsObject.postsCount;
        this.posts.forEach(post => {
          this.loadReplies(post.id);
      })},
      error: (err) => console.log(err),
    });
  }

  onCreate(form: NgForm){
    this.postService.formSubmitted = true;
    this.postService.postPost(this.threadId)
    .subscribe({
      next: res =>{
        this.postService.list = res as PostModel[];
        this.postService.resetForm(form)
        this.ngOnInit()
        this.toastr.success('was created successfully', 'Post')
      },
      error: err => console.log(err)
    })
  }

  populateForm(post: PostModel) {
    this.editingPostId = post.id;
    this.editContent = post.content;
  }

  cancelEdit() {
    this.editingPostId = null;
    this.editContent = '';
  }

  onUpdate(post: PostModel) {
    if (!this.editContent.trim()) {
      this.toastr.warning('Content cannot be empty', 'Edit Post');
      return;
    }

    this.postService.postFormData.content = this.editContent;
    this.postService.putPost(this.threadId, post.id).subscribe({
      next: () => {
        post.content = this.editContent;
        this.cancelEdit();
        this.toastr.info('Post was updated successfully', 'Edit Post');
      },
      error: (err) => console.log(err),
    });
    this.postService.postFormData.content = '';
  }

  onDelete(id: number){
    if(confirm('Are you sure to delete this message?'))
      this.postService.deletePost(this.threadId, id)
      .subscribe({
        next: res =>{
          this.postService.list = res as PostModel[];
          this.toastr.error('was deleted successfully', 'Thread')
          this.ngOnInit();
        },
        error: err => console.log(err)
      })
  }

  //Replies

  
  loadReplies(postId: number) {
    this.postService.getRepliesByPostId(this.threadId, postId).subscribe({
      next: (replies) => {
        this.replies[postId] = replies;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showReplyInput(postId: number) {
    this.replyingPostId = postId;
    this.replyContent = ''; // Reset reply content
  }

  cancelReply() {
    this.replyingPostId = null;
    this.replyContent = '';
  }

  onCreateReply(postId: number) {
    if (!this.replyContent.trim()) {
      this.toastr.warning('Reply content cannot be empty', 'Reply');
      return;
    }

    const replyModel = { content: this.replyContent };
    this.postService.postReply(this.threadId, postId, replyModel)
    .subscribe({
      next: (reply) => {
        if (!this.replies[postId]) {
          this.replies[postId] = [];
        }
        this.replies[postId].push(reply);
        this.cancelReply();
        this.toastr.success('Reply was added successfully', 'Reply');
      },
      error: (err) => console.log(err),
    });
  }

  startEditReply(replyId: number, currentContent: string) {
    this.editingReplyId = replyId;
    this.editReplyContent = currentContent;
  }

  // Method to cancel editing a reply
  cancelEditReply() {
    this.editingReplyId = null;
    this.editReplyContent = '';
  }

  // Method to update a reply
  onUpdateReply(replyId: number, postId: number) {
    if (!this.editReplyContent.trim()) {
      this.toastr.warning('Reply content cannot be empty', 'Edit Reply');
      return;
    }

    const updatedReply = { content: this.editReplyContent };
    this.postService.putReply(this.threadId, postId, replyId, updatedReply).subscribe({
      next: () => {
        // Update the reply content in the replies array
        const reply = this.replies[postId].find(r => r.id === replyId);
        if (reply) {
          reply.content = this.editReplyContent;
        }
        this.cancelEditReply();
        this.toastr.success('Reply was updated successfully', 'Edit Reply');
      },
      error: (err) => console.log(err),
    });
  }

  onDeleteReply(replyId: number, postId: number) {
    if (confirm('Are you sure you want to delete this reply?')) {
      this.postService.deleteReply(this.threadId, postId, replyId).subscribe({
        next: () => {
          // Remove the deleted reply from the replies array
          this.replies[postId] = this.replies[postId].filter(reply => reply.id !== replyId);
          this.toastr.error('Reply was deleted successfully', 'Delete Reply');
        },
        error: (err) => console.log(err),
      });
    }
  }

}