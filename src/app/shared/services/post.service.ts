import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostReplyModel } from 'src/app/models/post-reply.model';
import { PostModel } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  url:string = environment.apiBaseUrl + '/threads';
  list: PostModel[] = [];
  postFormData: PostModel = new PostModel;
  formSubmitted: boolean = false;

  getPostsByThreadId(threadId: number, pageNumber: number, pageSize: number) {
    let params = new HttpParams()
      .set('page', pageNumber)
      .set('pageSize', pageSize);
      
    return this.http.get<{ posts: PostModel[], postsCount: number}>(this.url + `/${threadId} /posts`, {params})
  }

  getRepliesByPostId(threadId: number, postId: number) {
    return this.http.get<PostReplyModel[]>(`${this.url}/${threadId}/posts/${postId}/replies`);
  }

  postPost(threadId: number){
    return this.http.post(this.url + `/${threadId} /posts`, this.postFormData);
  }

  postReply(threadId: number, postId: number, replyModel: { content: string }) {
    return this.http.post<PostReplyModel>(`${this.url}/${threadId}/posts/${postId}/replies`, replyModel);
  }

  putPost(threadId: number, postId: number) {
    return this.http.put(this.url + `/${threadId}/posts/${postId}`, this.postFormData);
  }

  putReply(threadId: number, postId: number, replyId: number, updatedReply: { content: string }) {
    return this.http.put(`${this.url}/${threadId}/posts/${postId}/replies/${replyId}`, updatedReply);
  }

  deletePost(threadId: number, postId: number) {
    return this.http.delete(this.url + `/${threadId}/posts/${postId}`);
  }

  deleteReply(threadId: number, postId: number, replyId: number) {
    return this.http.delete(`${this.url}/${threadId}/posts/${postId}/replies/${replyId}`);
  }

  resetForm(form: NgForm){
    form.form.reset();
    this.postFormData = new PostModel();
    this.formSubmitted = false;
  }
}
