import { Component } from '@angular/core';
import { GoogleAuthService } from '../service/google-auth.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { parse } from 'postcss';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user!:any
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly router:Router
    
  ) {
    this.user = JSON.parse(localStorage.getItem('user')!)
    console.log(this.user.email)
  }
  async logout() {
    await this.googleAuthService.logOut()
    this.router.navigate(['/'])
  }
  
}
