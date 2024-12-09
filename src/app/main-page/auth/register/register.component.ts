import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: `./register.component.html`,
  styleUrls: ['../auth.component.css']
})
export class RegisterComponent {

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private toastr : ToastrService
  ){}

  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null =>{
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if(password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({passwordMismatch: true})
    else
      confirmPassword?.setErrors(null)

    return null;
  }

  form = this.formBuilder.group({
    username : ['', Validators.required],
    email : ['', [Validators.required, Validators.email]],
    password : ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword : ['', Validators.required],
  },{validators: this.passwordMatchValidator})

  
  onSubmit(){
    this.isSubmitted = true;
    if(this.form.valid){
      this.service.createUser(this.form.value)
      .subscribe({
        next: (res:any) => {
          if(res.succeeded){
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('New user created', 'Registration Successful')
          }
          else
            console.log('Something went wrong')
        },
        error: err => {
          if (err.status == 400){
            this.toastr.error(err.error, 'Registration failed');
          }
          else
            console.log('error during registration:\n', err)
        }
          
      })
    }
  }

  hasDisplayableError(controlName: string): boolean{
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && 
    (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }
}
