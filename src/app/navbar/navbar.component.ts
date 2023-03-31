import { Component } from '@angular/core';
import { GoogleAuthService } from '../service/google-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly router:Router
    
  ) {}
  async logout() {
    await this.googleAuthService.logOut()
    this.router.navigate(['/'])
  }
}
