import { Component } from '@angular/core';
import { GoogleAuthService } from '../service/google-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private readonly googleAuthService:GoogleAuthService){

  }

}
