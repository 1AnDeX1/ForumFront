import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http"
import { environment } from 'src/environments/environment.development';
import { ForumThreadModel } from '../../models/thread.model';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(private http: HttpClient) { }

  url:string = environment.apiBaseUrl + '/ForumThreads';
  formData: ForumThreadModel = new ForumThreadModel;
  formSubmitted: boolean = false;

  getThreads(pageNumber: number, pageSize: number, title: string){
    let params = new HttpParams()
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('title', title);

    return this.http.get<{ threads: ForumThreadModel[], threadsCount: number }>(this.url, {params});
  }

  getThread(threadId: number) {
    return this.http.get<ForumThreadModel>(this.url+'/'+threadId);
  }

  postFormThread(){
    return this.http.post(this.url, this.formData)
  }

  putFormThread(){
    return this.http.put(this.url+'/'+this.formData.id, this.formData)
  }

  deleteFormThread(threadId: number){
    return this.http.delete(this.url+'/'+threadId)
  }

  resetForm(form: NgForm){
    form.form.reset();
    this.formData = new ForumThreadModel();
    this.formSubmitted = false;
  }
}
