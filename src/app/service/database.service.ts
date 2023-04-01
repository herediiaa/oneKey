import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../schema/User.schema';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
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
    return this.dataBaseFirestore
      .collection(`users/${userUid}/sites`)
      .doc()
      .set({
        siteName: values.siteName,
        siteUrl: values.siteUrl,
        siteImgUrl: values.siteImgUrl,
      });
  }
  loadSites(userUid: any) {
    return this.dataBaseFirestore
      .collection(`users/${userUid}/sites`)
      .valueChanges({ idField: 'id' });
  }
  editSite(values: any, userUid: string, siteId: string) {

    return this.dataBaseFirestore
      .collection(`users/${userUid}/sites`)
      .doc(siteId)
      .update({
        siteName: values.siteName,
        siteUrl: values.siteUrl,
        siteImgUrl: values.siteImgUrl,
      });
  }
  deliteSite(userUid: string, siteId: string) {
    return this.dataBaseFirestore
      .collection(`users/${userUid}/sites`)
      .doc(siteId)
      .delete()

  }

  /* QUERY FROM SITES PASSWORDS */

  createPassword(passwordData: any, siteId: string, userUid: string) {


    return this.dataBaseFirestore
      .collection(`users/${userUid}/sites/${siteId}/passwords`)
      .doc()
      .set(passwordData);
  }
  editPassword(passwordData: any, siteId: string, userUid: string,passwordId:string) {
    return this.dataBaseFirestore.collection(`users/${userUid}/sites/${siteId}/passwords`).doc(passwordId).update({
      email:passwordData.email,
      password:passwordData.password,
      username:passwordData.username
    }

    )

  }
  delitePassword(userId:string,siteId:string,passwordId:string){
    return this.dataBaseFirestore.collection(`users/${userId}/sites/${siteId}/passwords`).doc(passwordId).delete()
  }
  loadPasswords(siteId: string, userUid: string) {
    return this.dataBaseFirestore
    .collection(`users/${userUid}/sites/${siteId}/passwords`)
    .valueChanges({ idField: 'id' })
   
  }
}
