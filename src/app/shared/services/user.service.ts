import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  formData: UserModel = new UserModel;
  constructor(private http: HttpClient) { }

  url:string = environment.apiBaseUrl + '/User';

  getUsers(pageNumber: number, pageSize: number, userName: string){
    let params = new HttpParams()
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('userName', userName);

    return this.http.get<{ users: UserModel[], usersCount: number }>(this.url, {params});
  }

  getUserById(userId: string){
    return this.http.get<UserModel>(this.url + '/' + userId)
  }

  putUser(){
    return this.http.put<UserModel>(this.url+'/'+this.formData.id, this.formData)
  }

  deleteUser(userId: string){
    return this.http.delete(this.url + '/' + userId)
  }
}
