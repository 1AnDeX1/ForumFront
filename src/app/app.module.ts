import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ThreadDetailsComponent } from './main-page/thread-details/thread-details.component';
import { ThreadCreateFormComponent } from './main-page/thread-create-form/thread-create-form.component';
import { LoginComponent } from './main-page/auth/login/login.component';
import { RegisterComponent } from './main-page/auth/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './main-page/auth/auth.component';
import { FirstKeyPipe } from './shared/pipes/first-key.pipe';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './shared/auth.interceptor';
import {MatIconModule} from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HideIfClaimsNotMetDirective } from './shared/directives/hide-if-claims-not-met.directive';
import { AdminPageComponent } from './main-page/admin-page/admin-page.component';
import { UserUpdateComponent } from './main-page/admin-page/user-update/user-update.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ThreadDetailsComponent,
    ThreadCreateFormComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    FirstKeyPipe,
    HideIfClaimsNotMetDirective,
    AdminPageComponent,
    UserUpdateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    MatPaginatorModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
