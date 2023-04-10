import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'profile/:name', component: ProfileComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations:[
    PageNotFoundComponent,
    DashboardComponent,
    ProfileComponent
    ],
  imports: [ RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
