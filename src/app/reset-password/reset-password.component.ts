import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  formGroup!: FormGroup;
  isError: boolean = false;
  isSuccess: boolean = false;
  popMessage!: string;

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private readonly formbuilder: FormBuilder
  ) {
    this.formGroup = this.createForm();
  }

  onSubmit(values: any) {
    this.googleAuthService.ForgotPassword(values.email).then((response)=>{
      if(response === "success"){
        this.formSucces("Password reset email sent, check your inbox")
        setTimeout(() => {
          this.router.navigate(["/login"])
        }, 2000);
      }if(response.code === "auth/invalid-email"){
        this.formError("Password reset email is not valid")
        setTimeout(() => {
          this.isError = false
          this.resetForm()
        }, 2000);
      }
    })
     console.log(values.email)
  }
 

  createForm() {
    return this.formbuilder.group({
      email: ['', Validators.required],
    });
  }
  resetForm() {
    const form = document.querySelector('form');
    form?.reset();
  }
  formError(text: string) {
    this.isError = true;
    this.popMessage = text;
  }
  formSucces(text: string) {
    this.isSuccess = true;
    this.popMessage = text;
  }

}
