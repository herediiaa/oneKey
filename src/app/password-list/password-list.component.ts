import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GoogleAuthService } from '../service/google-auth.service';
import { AES, enc } from 'crypto-js';
import { DatabaseService } from '../service/database.service';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environments.prod';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css'],
})
export class PasswordListComponent implements OnInit {
  ngOnInit(): void {
      window.scrollTo(0,0)
  }
  passwordDecrypte!: string;
  siteInfo!: any;
  sitePasswords!: Array<any>;
  formGroup!: FormGroup;
  userInfo!: any;
  canEdit: boolean = false;

  formStatus: string = 'Add New';
  formPasswordId!: string;

  isSuccess: boolean = false;
  popText!: string;

  decrypStatus: string = 'Decrypt';
  constructor(
    private readonly router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private readonly googleAuthService: GoogleAuthService,
    private readonly databaseService: DatabaseService,
    private dom: ElementRef
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user')!);
    this.formGroup = this.createForm();
    this.router.queryParams.subscribe((data: any) => {
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
      await this.databaseService
        .createPassword(passwordData, this.siteInfo.id, this.userInfo.uid)
        .then(() => {
          this.resetForm();
          this.redirijir("passwordSeccion")
          this.messageSuccessfull('User & Password Added Correctly');
          setTimeout(() => {
            this.isSuccess = false;
          }, 3000);
        });
    } else if(this.formStatus == 'Edit') {
      passwordData.password = this.encrypPassword(passwordData.password)
      this.databaseService
        .editPassword(
          passwordData,
          this.siteInfo.id,
          this.userInfo.uid,
          this.formPasswordId
        )
        .then(() => {
          this.decrypStatus = 'Decrypt';
          this.resetForm();
          this.messageSuccessfull('User & Password Edit Correctly');
          setTimeout(() => {
            this.isSuccess = false;
          }, 2000);
        });
    }
  }
  loadPassword() {
    this.databaseService
      .loadPasswords(this.siteInfo.id, this.userInfo.uid)
      .subscribe((val) => {
        this.sitePasswords = val;
      });
  }
  onDelitePassword(passwordId: string) {
    this.databaseService
      .delitePassword(this.userInfo.uid, this.siteInfo.id, passwordId)
      .then(() => {
        this.resetForm()
        this.messageSuccessfull('Password Delited Correctly');
        setTimeout(() => {
          this.isSuccess = false;
        }, 2000);
      });
  }
  onEditPassword(password: any) {
    this.redirijir('formSeccion')
    this.formPasswordId = password.id;
    const pas = password.password;
    const a = this.decryptPassword(pas);
    console.log(a);
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
    const secretKey = environment.keyEncrypt;
    const passwordEncrypted = AES.encrypt(password, secretKey).toString();
    return passwordEncrypted;
  }
  decryptPassword(password: string) {
    const secretKey = environment.keyEncrypt;
    const decryptPassword = AES.decrypt(password, secretKey).toString(enc.Utf8);
    return decryptPassword;
  }
  onDecryptPassword(password: string, i: any) {
    if (this.decrypStatus === 'Encrypt') {
      const decPassword = this.encrypPassword(password);
      this.sitePasswords[i].password = decPassword;
      this.canEdit = false;
      this.decrypStatus = 'Decrypt';
    } else if (this.decrypStatus == 'Decrypt') {
      const decPassword = this.decryptPassword(password);
      this.sitePasswords[i].password = decPassword;
      this.canEdit = true;
      this.decrypStatus = 'Encrypt';
    }
  }

  onCancel() {
    this.resetForm()
  }

  createForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  redirijir(id:string){
    const seccion = this.dom.nativeElement.querySelector(`#${id}`)
    seccion.scrollIntoView({ behavior: 'smooth' });
  }
}
