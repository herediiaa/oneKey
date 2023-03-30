import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formGroup!: FormGroup;

  isError: boolean = false;
  googleAuth: any;
  constructor(
    private readonly googleAuthService:GoogleAuthService,
    private router: Router,
    private readonly formbuilder: FormBuilder,
  ) {
    this.formGroup = this.createForm();
  }
  onSubmit(value: any) {
    this.googleAuthService.logIn(value.email,value.password).then((userReference:any)=>{
      console.log("estaba ya registrado", userReference)
    }).catch((err:any)=>{
      console.log("usuario no esta registrado", err)
    })
  }
  createForm() {
    return this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onEnterGoogle(){
    this.googleAuthService.googleAuth().then(()=>{
      this.router.navigate([''])
    })
  }

}
