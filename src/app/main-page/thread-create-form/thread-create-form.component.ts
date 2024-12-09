import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ThreadService } from 'src/app/shared/services/thread.service';

@Component({
  selector: 'app-thread-create-form',
  templateUrl: `./thread-create-form.component.html`,
  styleUrls: ['./thread-create-form.component.css']
})
export class ThreadCreateFormComponent {
  constructor(
    public service: ThreadService,
    private toastr: ToastrService
  ){ 
  }

  onSubmit(form: NgForm){
    this.service.formSubmitted = true;
    if(form.valid){
      if(this.service.formData.id == 0)
        this.createThread(form)
      else
        this.updateThread(form)
    }
  }

  createThread(form:NgForm){
    this.service.postFormThread()
    .subscribe({
      next: res =>{
        this.toastr.success('was created successfully', 'Thread')
      },
      error: err => console.log(err)
    })
    this.service.resetForm(form)
  }
  updateThread(form:NgForm){
    this.service.putFormThread()
    .subscribe({
      next: res =>{
        this.toastr.info('was updated successfully', 'Thread')
      },
      error: err => console.log(err)
    })
    this.service.resetForm(form)
  }
}
