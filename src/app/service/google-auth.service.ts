import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { User } from '../schema/User.schema';
import * as auth from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor(
    private readonly firestoreModule: Firestore,
    private readonly afAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly databaseService: DatabaseService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/site-list'])
        console.log('hay un usuario logeado')
        return;
      }
      console.log('no hay nadie logeado');

    });
  }
  async singUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userReference) => {
        this.databaseService.createUser(userReference.user);
        return true;
      })
      .catch((error) => {
        return error.code;
      });
  }
  logIn(email:string,password:string){
    return this.afAuth.signInWithEmailAndPassword(email,password)
  }
  googleAuth(){
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then((userDocReference)=>{
      console.log(userDocReference)
      this.databaseService.createUser(userDocReference.user)
    })
  }
  logOut() {
    this.afAuth.signOut();
    localStorage.setItem("user","null")
    return true
  }

}
