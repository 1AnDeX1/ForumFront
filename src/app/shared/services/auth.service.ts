import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { TOKEN_KEY, USER_NAME } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  createUser(formData: any){
    return this.http.post(environment.apiBaseUrl + '/Authentication/registration', formData)
  }

  signin(formData: any){
    return this.http.post(environment.apiBaseUrl + '/Authentication/login', formData)
  }

  isLoggedIn() {
    return this.getToken() != null;
  } 

  deleteToken(){
    localStorage.removeItem(TOKEN_KEY);
  }

  saveToken(token: string){
    localStorage.setItem(TOKEN_KEY, token)
  }

  getToken(){
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUserName(userName: string){
    localStorage.setItem(USER_NAME, userName)
  }

  getUserName(): string | null {
    return localStorage.getItem(USER_NAME);
  }

  deleteUserName() {
    localStorage.removeItem(USER_NAME);
  }
  
  getClaims() {
    const token = this.getToken();
    
    if (!token) {
      return "";
    }
  
    try {
      const payload = token.split('.')[1];
      return JSON.parse(window.atob(payload));
    } catch (error) {
      console.error('Error decoding token claims:', error);
      return null;
    }
  } 
}
