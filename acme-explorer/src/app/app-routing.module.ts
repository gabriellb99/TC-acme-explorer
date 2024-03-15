import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { TripListComponent } from './components/trip/components/trip/trip-list/trip-list.component';

const routes: Routes = [
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},
{path: 'trips/:id', component: TripDisplayComponent, pathMatch: 'full'},
{path: '', component: TripListComponent, pathMatch: 'full'},
{path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
