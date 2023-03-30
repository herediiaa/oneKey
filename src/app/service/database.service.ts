import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../schema/User.schema';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private readonly dataBaseFirestore: AngularFirestore) {}

  createUser(user: any) {
    this.dataBaseFirestore.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      isVerified: user.emailVerified,
      name: user.displayName,
      photoUrl: user.photoURL,
    });
  }

  saveSite(values: any, userUid: any) {
    return this.dataBaseFirestore.collection(`users/${userUid}/sites`).doc().set({
      siteName: values.siteName,
      siteUrl: values.siteUrl,
      siteImgUrl: values.siteImgUrl,
    });
    
  }
  loadSites(userUid: any) {
    return this.dataBaseFirestore
      .collection(`users/${userUid}/sites`)
      .valueChanges({idField:"id"})
  }
  editSite(values:any,userUid:string,siteId:string){
    console.log( `se esta actualizando este usuario ${userUid}, con esta informacion ${values.siteName} de este sitio ${siteId}`)
    return this.dataBaseFirestore.collection(`users/${userUid}/sites`).doc(siteId).update({
      siteName: values.siteName,
      siteUrl: values.siteUrl,
      siteImgUrl: values.siteImgUrl,
    })
    
  }
  deliteSite(userUid:string,siteId:string){
    return this.dataBaseFirestore.collection(`users/${userUid}/sites`).doc(siteId).delete().then(()=>{
      console.log(`eliminando el sitio ${siteId} del usuario ${userUid}`)
    })
  }

  /* real time database */
  /*   updateUser(user: any):void{
    this.db.object<any>('/users/' + user.uid).update({
      uid: user.uid,
      name:user.displayName,
      email: user.email,
      isAdmin: false,
      photoUrl:user.photoURL
      
    })
  } */
}
