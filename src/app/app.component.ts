import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  
  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();

  }

  onLogout(){
    this.authService.deleteToken();
    this.authService.deleteUserName();
    this.toastr.success("successful", "Log out");
  };
}

