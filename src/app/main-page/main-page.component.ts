import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThreadService } from '../shared/services/thread.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ForumThreadModel } from '../models/thread.model';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { claimReq } from '../shared/utils/claimReq-utils';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainPageComponent implements OnInit{

  currentUser: string | null = null;
  pageSize = 10;
  pageNumber = 1;
  threadsCount = 0;
  threads: ForumThreadModel[] = [];
  searchTitle: string = '';

  claimReq = claimReq;

  constructor(
    public service: ThreadService,
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
    ){
    
  }

  ngOnInit(): void {
    this.loadThreads();
    this.currentUser = this.authService.getUserName();
  }

  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadThreads();
  }

  loadThreads(){
    this.service.getThreads(this.pageNumber, this.pageSize, this.searchTitle)
    .subscribe({
      next: res =>{
        this.threads = [...res.threads] as ForumThreadModel[];
        this.threadsCount = res.threadsCount;
      },
      error: err => { console.log(err)}
    })
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadThreads();
  }

  goToCreateThread() {
    this.router.navigate(['/create-thread']);
  }

  populateForm(selectedThread: ForumThreadModel){
    this.goToCreateThread();
    this.service.formData = { ...selectedThread };
  }
  
  threadDetails(id: number){
    this.router.navigate(['/thread-details', id]);
  }

  onDelete(id: number){
    if(confirm('Are you sure to delete this message?'))
      this.service.deleteFormThread(id)
      .subscribe({
        next: res =>{
          this.threads = res as ForumThreadModel[];
          this.toastr.error('was deleted successfully', 'Thread')
          this.ngOnInit();
        },
        error: err => console.log(err)
      })
  }
}