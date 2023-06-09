import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { SiteListComponent } from './site-list/site-list.component';
import { PasswordListComponent } from './password-list/password-list.component';
import { GuardGuard } from './guards/guard.guard';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AComponent } from './a/a.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'a',
    component: AComponent,
  },

  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'singUp',
    component: SingUpComponent,
  },
  {
    path: 'site-list',
    component: SiteListComponent,
    canActivate: [GuardGuard],
  },
  {
    path: 'password-list',
    component: PasswordListComponent,
    canActivate: [GuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
