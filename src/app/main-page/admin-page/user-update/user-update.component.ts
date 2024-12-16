import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: `./user-update.component.html`,
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent {
  constructor(
    public formBuilder: FormBuilder,
    public userService: UserService,
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
      this.userService.putUser()
      .subscribe({
        next: (res: any) => {
          if (res.email && res.userName) {
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('Updated successfully', 'User');
          } else {
            console.log('Something went wrong', res);
            this.toastr.error('Something went wrong', 'Update failed');
          }
        },        
        error: err => {
          if (err.status == 400){
            this.toastr.error(err.error, 'Updating failed');
          }
          else
            console.log('error during updating:\n', err)
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
