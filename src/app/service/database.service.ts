import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../schema/User.schema';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db:AngularFireDatabase, private readonly dataBaseFirestore:AngularFirestore) { }

  createUser(user:any){
    this.dataBaseFirestore.collection('users').doc(user.uid).set({
      uid:user.uid,
      email:user.email,
      isVerified: user.emailVerified,
      name:user.displayName ,
      photoUrl: user.photoURL, 
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
