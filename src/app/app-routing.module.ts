import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadCreateFormComponent } from './main-page/thread-create-form/thread-create-form.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterComponent } from './main-page/auth/register/register.component';
import { AuthComponent } from './main-page/auth/auth.component';
import { LoginComponent } from './main-page/auth/login/login.component';
import { authGuard } from './shared/auth.guard';
import { ThreadDetailsComponent } from './main-page/thread-details/thread-details.component';
import { AdminPageComponent } from './main-page/admin-page/admin-page.component';
import { UserUpdateComponent } from './main-page/admin-page/user-update/user-update.component';

const routes: Routes = [
  { path: '', component: MainPageComponent},
  { path: 'admin-page', component: AdminPageComponent},
  { path: 'user-update', component: UserUpdateComponent},
  { path: 'create-thread', component: ThreadCreateFormComponent,
    canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent,
    children:[
      {path: 'signup', component: RegisterComponent},
      {path: 'signin', component: LoginComponent}
    ]
   },
   { path: 'thread-details/:id', component: ThreadDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
