import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { claimReq } from './shared/utils/claimReq-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService)
    {}

  currentUser: string | null = null;
  private userSubscription!: Subscription;
  
  claimReq = claimReq;
  
  ngOnInit(): void {
    this.userSubscription = this.authService.getUserName$().subscribe((userName) => {
      this.currentUser = userName;
    });
    if(this.currentUser == null){
      this.currentUser = this.authService.getUserName();
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onLogout(){
    this.authService.deleteToken();
    this.authService.deleteUserName();
    this.toastr.success("successful", "Log out");
  };
}

