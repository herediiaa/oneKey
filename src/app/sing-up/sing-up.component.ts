import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';
import { user } from '@angular/fire/auth';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css'],
})
export class SingUpComponent {
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
    this.googleAuthService
      .singUp(values.email, values.password)
      .then((erroCode) => {
        if (erroCode ==='auth/email-already-exists') {
          this.formError(`${values.email} is already in use `)
          setTimeout(() => {
            this.isError = false
          }, 2000);
          this.resetForm();
          return
        }else if(erroCode ==='auth/invalid-email'){
          this.formError(`Email ${values.email} is not correct `)
          setTimeout(() => {
            this.isError = false
          }, 2000);
          this.resetForm();
          return
        }
        else if(erroCode ==='auth/weak-password'){
          this.formError(`Password must have at least 6 characters `)
          setTimeout(() => {
            this.isError = false
          }, 2000);
          this.resetForm();
          return
        }
        else if(erroCode ==='auth/email-already-in-use'){
          this.formError(`${values.email} is already registered `)
          setTimeout(() => {
            this.isError = false
          }, 2000);
          this.resetForm();
          return
        }

        this.formSucces("usuario creado y en base de datos")
        setTimeout(() => {
          this.isSuccess = false
        }, 2000);
        this.resetForm();

      })
    console.log(values);
  }
  onLogOut(){
    this.googleAuthService.logOut()
    localStorage.setItem("users","null")
  }

  createForm() {
    return this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
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
  /*
  registerByGoogle(){
    return this.googleAuth.googleAuth()
  }
  onCreateAccout(email:string,password:string){
    this.googleAuth.signUp
  } */
}
