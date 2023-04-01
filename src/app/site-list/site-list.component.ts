import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../service/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { doc } from '@angular/fire/firestore';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {
  ngOnInit(): void {
      window.scrollTo(0,0)
  }
  constructor(
    private readonly databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private readonly afAuth:AngularFireAuth,
    private dom: ElementRef
  ) {
    this.formGroup = this.createForm()
    this.userInfo = JSON.parse(localStorage.getItem("user")!)
    this.loadSites(this.userInfo.uid)
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

  allSites!: Array<any>;
  loadSites(userUid:string) {
   this.databaseService.loadSites(userUid).subscribe((doc)=>{
    this.allSites = doc
   })

  } 
  onSubmit(values:any) {
    if (this.formState === 'Add New') {
      this.databaseService.saveSite(values,this.userInfo.uid).then(()=>{
        this.resetForm()
        this.redirijir("cardSeccion")
        this.messageSuccessfull("site create correctly")
        setTimeout(() => {
          this.isSuccess = false
        }, 2000);
      })
      return

    } else if (this.formState === 'Edit') {
      this.databaseService.editSite(values,this.userInfo.uid,this.formCurrentIdSite).then(() => {
        this.resetForm()
        this.redirijir("cardSeccion")
        this.messageSuccessfull(`Site ${values.siteName} edit correctly `)

        setTimeout(() => {
          this.isSuccess = false
        }, 2000);
      })
      return
    }
  }
  editSite(site: any) {
    this.redirijir("formSeccion")
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
    this.formState = "Add New"
  }
  deliteSite(site:any) {
    this.databaseService.deliteSite(this.userInfo.uid,site.id).then(()=>{
      this.messageSuccessfull(`Site ${site.siteName} delite correctly`)
      this.onCancel()
      setTimeout(() => {
        this.isSuccess = false
      }, 2000);
    })

  }
  messageSuccessfull(mesagge: string) {
    this.isSuccess = true;
    this.popText = mesagge;
  }
  resetForm(){
    const form = document.querySelector("form")
    form?.reset()
  }
  redirijir(id:string){
    const seccion = this.dom.nativeElement.querySelector(`#${id}`)
    seccion.scrollIntoView({ behavior: 'smooth' });
  }
}
