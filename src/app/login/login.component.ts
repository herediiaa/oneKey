import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formGroup!: FormGroup;
  popMessage!: string;
  isError: boolean = false;
  googleAuth: any;
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private router: Router,
    private readonly formbuilder: FormBuilder
  ) {
    this.formGroup = this.createForm();
  }
  onSubmit(value: any) {
    this.googleAuthService
      .logIn(value.email, value.password)
      .then((userReference: any) => {
        this.router.navigate(['/site-list']);
      })
      .catch((err: any) => {
        if (err.code == 'auth/user-not-found') {
          this.formError(`${value.email} is not a valid user`);
          setTimeout(() => {
            this.isError = false;
          }, 2000);
        }else if(err.code == 'auth/invalid-email'){
          this.formError(`${value.email} is not a valid user`);
          setTimeout(() => {
            this.isError = false;
          }, 2000);
        }
        else if(err.code == 'auth/wrong-password'){
          this.formError(`${value.email} is not a valid user`);
          setTimeout(() => {
            this.isError = false;
          }, 2000);
        }else if(err.code == 'auth/too-many-requests'){
          this.formError(`Please Do It Later`);
          setTimeout(() => {
            this.isError = false;
          }, 2000);
        }
        
      });
  }
  createForm() {
    return this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onEnterGoogle() {
    this.googleAuthService.googleAuth().then(() => {
      this.router.navigate(['']);
    });
  }
  formError(text: string) {
    this.isError = true;
    this.popMessage = text;
  }
}
