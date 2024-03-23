import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';


const routes: Routes = [
  { path: '', component: HomeScreenComponent},
  { path: ':year/dashboard', component: DashboardComponent },
  { path: ':year/profile/:name', component: ProfileComponent },
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
