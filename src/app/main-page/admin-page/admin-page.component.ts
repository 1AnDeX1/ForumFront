import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: `./admin-page.component.html`,
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit{

  pageSize = 10;
  pageNumber = 1;
  usersCount = 0;
  users: UserModel[] = [];
  userName: string = "";

  constructor(private service: UserService,
    private router: Router,
    private toastr: ToastrService
  ){

  }


  ngOnInit(): void {
    this.loadUsers();
  }

  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
  
  loadUsers(){
    this.service.getUsers(this.pageNumber, this.pageSize, this.userName)
    .subscribe({
      next: res =>{
        this.users = [...res.users] as UserModel[];
        this.usersCount = res.usersCount;
      },
      error: err => { console.log(err)}
    })
  }

  editUser(selectedUser: UserModel) {
    this.router.navigate(['/user-update']);
    this.service.formData = { ...selectedUser };
  }
  
  onDelete(id: string){
    if(confirm("Are you sure to delete this user?"))
      this.service.deleteUser(id)
      .subscribe({
        next: res => {
          this.users = res as UserModel[];
          this.toastr.error('was deleted successfully', 'User')
          this.ngOnInit();
        },
        error: err => console.log(err)
      })

  }
}
