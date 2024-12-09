import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: `./login.component.html`,
  styleUrls: ['../auth.component.css']
})
export class LoginComponent {
  isSubmitted : boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private service : AuthService,
    private toastr : ToastrService
  ){}

  form = this.formBuilder.group({
    username : ['', [Validators.required]],
    password : ['', [Validators.required]]
  })


  hasDisplayableError(controlName: string): boolean{
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && 
    (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.valid){
      this.service.signin(this.form.value)
      .subscribe({
        next: (res: any) =>{
          this.service.saveToken(res.token);
          this.service.saveUserName(res.userName);
          this.toastr.success('', 'Sing in successful');
        },
        error: err =>{
          if(err.status == 400){
            this.toastr.error('Incorrect email or password', 'Login failed')
          }
          else
            console.log('error during login:\n', err)
        }
      })
    }
  }
}

