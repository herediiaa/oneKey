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
    console.log(
      `se esta actualizando este usuario ${userUid}, con esta informacion ${values.siteName} de este sitio ${siteId}`
    );
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
      .then(() => {
        console.log(`eliminando el sitio ${siteId} del usuario ${userUid}`);
      });
  }

  /* QUERY FROM SITES PASSWORDS */

  createPassword(passwordData: any, siteId: string, userUid: string) {
    console.log(
      `estas agregando una contrase al sitio ${siteId} con estos datos ${JSON.stringify(
        passwordData
      )} de este usuario ${userUid}`
    );

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
    console.log(
      `estas editando esta ${passwordId} contrasena del sitio ${siteId} con estos datos ${JSON.stringify(
        passwordData
      )} de este usuario ${userUid}`
    );
  }
  delitePassword(userId:string,siteId:string,passwordId:string){
    return this.dataBaseFirestore.collection(`users/${userId}/sites/${siteId}/passwords`).doc(passwordId).delete()
    console.log( `borrando contrasena de usuario ${userId} del sitio ${siteId} y contrasena ${passwordId}`)
  }
  loadPasswords(siteId: string, userUid: string) {
    return this.dataBaseFirestore
    .collection(`users/${userUid}/sites/${siteId}/passwords`)
    .valueChanges({ idField: 'id' })
   
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
