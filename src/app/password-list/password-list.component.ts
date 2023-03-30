import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';
import { AES, enc } from 'crypto-js';
import { DatabaseService } from '../service/database.service';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css'],
})
export class PasswordListComponent {
  passwordDecrypte!: string;
  siteInfo!: any;
  sitePasswords!: Array<any>
  formGroup!: FormGroup;
  userInfo!: any;

  formStatus: string = 'Add New';
  formPasswordId!: string;

  isSuccess: boolean = false;
  popText!: string;

  decrypStatus: string = 'Decrypt';
  constructor(
    private readonly router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private readonly googleAuthService: GoogleAuthService,
    private readonly databaseService: DatabaseService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user')!);
    console.log(this.userInfo);
    this.formGroup = this.createForm();
    this.router.queryParams.subscribe((data: any) => {
      console.log(data);
      this.siteInfo = data;
      /* site.id
      site.siteName
      site.siteImgUrl
      site.Url */
    });
    this.loadPassword();
  }
  async onSubmit(passwordData: any) {
    if (this.formStatus == 'Add New') {
      passwordData.password = this.encrypPassword(passwordData.password);
      console.log(passwordData);
      await this.databaseService
        .createPassword(passwordData, this.siteInfo.id, this.userInfo.uid)
        .then(() => {
          this.resetForm();
          this.messageSuccessfull('User & Password Added Correctly');
          setTimeout(() => {
            this.isSuccess = false;
          }, 2000);
        });
    } else {
      this.databaseService
        .editPassword(
          passwordData,
          this.siteInfo.id,
          this.userInfo.uid,
          this.formPasswordId
        )
        .then(() => {
          this.resetForm();
          this.messageSuccessfull('User & Password Edit Correctly');
          setTimeout(() => {
            this.isSuccess = false;
          }, 2000);
        });
    }
    /* if (this.formStatus === 'Add New') {
      data.password = this.encrypPassword(data.password);
      this.passwordManagerService
        .addPasswords(data, this.siteInfo.id)
        .then(() => {
          this.resetForm();
          this.messageSuccessfull('User & Password Added Correctly');
          setTimeout(() => {
            this.isSuccess = false;
          }, 2000);
        })
        .catch((err:any) => {
          console.log(err);
        }); */
  } /* else if (this.formStatus === 'Edit') {
      this.passwordManagerService
        .editPassword(this.formPasswordId, this.siteInfo.id, data)
        .then(() => {
          this.resetForm();
          this.messageSuccessfull('User & Password Edit Correctly');
          setTimeout(() => {
            this.isSuccess = false;
          }, 2000);
        })
        .catch((err:any) => {
          console.log(err);
        });
    }
  } */
  loadPassword() {
     this.databaseService.loadPasswords(
      this.siteInfo.id,
      this.userInfo.uid
    ).subscribe((val)=>{
      this.sitePasswords = val
    })

    
  }
  onDelitePassword(passwordId: string) {
    console.log(passwordId); /* id de la contrasena */
    this.databaseService
      .delitePassword(this.userInfo.uid, this.siteInfo.id, passwordId)
      .then(() => {
        this.messageSuccessfull('Password Delited Correctly');
        setTimeout(() => {
          this.isSuccess = false;
        }, 2000);
      });
  }
  onEditPassword(password: any) {
    this.formPasswordId = password.id;
    this.formGroup.setValue({
      username: password.username,
      email: password.email,
      password: password.password,
    });
    this.formStatus = 'Edit';
  }

  resetForm() {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
    });
    this.formStatus = 'Add New';
  }
  messageSuccessfull(mesagge: string) {
    this.isSuccess = true;
    this.popText = mesagge;
  }

  encrypPassword(password: string) {
    const secretKey = 'G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThW';
    const passwordEncrypted = AES.encrypt(password, secretKey).toString();
    return passwordEncrypted;
  }
  decryptPassword(password: string) {
    const secretKey = 'G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThW';
    const decryptPassword = AES.decrypt(password, secretKey).toString(enc.Utf8);
    return decryptPassword;
  }
  onDecryptPassword(password: string, i: any) {
    if (this.decrypStatus === "Encrypt") {
      const decPassword = this.encrypPassword(password);
      this.sitePasswords[i].password = decPassword
      console.log("mostrando contrasena encriptada")
      console.log(decPassword)
      this.decrypStatus = "Decrypt"
    }
    else if(this.decrypStatus == "Decrypt"){
      const decPassword = this.decryptPassword(password);
      this.sitePasswords[i].password = decPassword
      this.decrypStatus = "Encrypt"
      console.log("password ")
    }
  }
  createForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
