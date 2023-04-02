import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.css'],
})
export class AComponent {
  formGroup!: FormGroup;
  isError: boolean = false;
  isSuccess: boolean = false;
  popMessage!: string;
  oobCode!: any;

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private routerUrl: ActivatedRoute,
    private readonly formbuilder: FormBuilder
  ) {
    this.formGroup = this.createForm();
  }

  areFieldsEqual() {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.formGroup.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  onSubmit(values: any) {
    if (this.areFieldsEqual()) {
      this.routerUrl.queryParams.subscribe((data: any) => {
        const { oobCode } = data;
        this.oobCode = oobCode;
        console.log(this.oobCode);
      });
      const { password } = values;
      console.log(password);
      this.googleAuthService
        .confirmPasswordReset(this.oobCode, password)
        .then((response) => {
          if (response === "success") {
            this.formSucces('Password Changed Successfully');
            setTimeout(() => {
              this.isSuccess = false;
              this.router.navigate(['/login'])

            }, 2000);
          } else if(response.code = "auth/weak-password") {
            this.formError('Password must be at least 6 characters');
            setTimeout(() => {
              this.isError = false;
              this.resetForm()
            }, 2000);
          }
        });
      return;
    }
    this.formError('Password must be equals');
    setTimeout(() => {
      this.isError = false;
    }, 2000);
  }

  createForm() {
    return this.formbuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
