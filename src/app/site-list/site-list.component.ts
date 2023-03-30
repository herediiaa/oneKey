import { Component } from '@angular/core';
import { DatabaseService } from '../service/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent {
  constructor(
    private readonly databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private readonly afAuth:AngularFireAuth
  ) {
    this.formGroup = this.createForm()
    this.userInfo = JSON.parse(localStorage.getItem("user")!)
    console.log(this.userInfo)
    console.log(this.userInfo?.uid)
    this.loadSites(this.userInfo.uid);

  }
 
  formGroup!: FormGroup 
  userInfo!:any
  createForm(){
  return this.formBuilder.group({
    siteName: ["",Validators.required,],
    siteUrl: ["",Validators.required],
    siteImgUrl: ["",Validators.required],
  })}
 
  formCurrentIdSite!: string;
  formState: string = 'Add New';

  isSuccess: boolean = false;
  popText!: string;
  allSites!: Observable<Array<any>>;
  loadSites(userUid:string) {
    this.allSites = this.databaseService.loadSites(userUid)
    this.allSites.forEach(doc => {
      console.log(doc)
    });
  } 
  onSubmit(values:any) {
    if (this.formState === 'Add New') {
      console.log("el user id del que esta en linea es ",this.userInfo.uid )
      console.log(values)
      console.log(this.userInfo.uid)
      this.databaseService.saveSite(values,this.userInfo.uid).then(()=>{
        this.resetForm()
        this.messageSuccessfull("site create correctly")
        setTimeout(() => {
          this.isSuccess = false
        }, 2000);
      })
      return

    } else if (this.formState === 'Edit') {
      this.databaseService.editSite(values,this.userInfo.uid,this.formCurrentIdSite).then(() => {
        this.resetForm()
        this.messageSuccessfull(`Site ${values.siteName} edit correctly `)

        setTimeout(() => {
          this.isSuccess = false
        }, 2000);
      })
      return
    }
  }
  editSite(site: any) {
    this.formCurrentIdSite = site.id;
    this.formGroup.setValue({
      siteName: site.siteName,
      siteUrl: site.siteUrl,
      siteImgUrl: site.siteImgUrl,
    })
    this.formState = 'Edit';
  }
  onCancel(){
    this.formGroup.setValue({
      siteName: "",
      siteUrl: "",
      siteImgUrl: "",
    })
    this.formState = "New"
  }
  deliteSite(site:any) {
    this.databaseService.deliteSite(this.userInfo.uid,site.id).then(()=>{
      this.messageSuccessfull(`Site ${site.siteName} delite correctly`)
      setTimeout(() => {
        this.isSuccess = false
      }, 2000);
    })
   /*  this.passwordManagerService
      .deliteSite(id)
      .then(() => {
        'delite site successfully';
        setTimeout(() => {
          this.isSuccess = false;
        }, 2000);
      })
      .catch(() => {
        'something went wrong';
      }); */
  }
  messageSuccessfull(mesagge: string) {
    this.isSuccess = true;
    this.popText = mesagge;
  }
  resetForm(){
    const form = document.querySelector("form")
    form?.reset()
  }

}
