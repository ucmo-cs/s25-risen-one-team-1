import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { EdwComponent } from './edw/edw.component';
import { NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import {AccountComponent} from "./account/account.component";

export const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'home', component: HomeComponent },
{ path: 'edw', component: EdwComponent },
{path: 'account', component: AccountComponent}
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule{}
