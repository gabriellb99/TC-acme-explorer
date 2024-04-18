import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { TripListComponent } from './components/trip/components/trip/trip-list/trip-list.component';
import { ActorRoleGuard } from './guards/actor-role.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StageComponent } from './components/trip/stage/stage.component';
import { ApplyComponent } from './components/trip/apply/apply.component';
import { PaymentComponent } from './components/trip/payment/payment.component';
import { DeniedAccessComponent } from './components/shared/denied-access/denied-access.component';
import { TripTableComponent } from './components/trip/trip-table/trip-table.component';
import { SponsorTableComponent } from './components/sponsor/sponsor/sponsor-table/sponsor-table.component';
import { TripFormComponent } from './components/trip/trip-form/trip-form.component';
import { LeaveFormGuard } from './guards/leave-form.guard';


const routes: Routes = [
{path: 'login', component: LoginComponent,
  canActivate: [ActorRoleGuard], data: {expectedRole: 'anonymous'}},
{
  path: 'dashboard', 
  component: DashboardComponent,
  canActivate: [ActorRoleGuard], 
  data: {expectedRole: 'administrator,manager'}
},
{
  path: 'register',
  children: [
    {path: ':id', component: RegisterComponent},
    {path: '', component: RegisterComponent, canActivate: [ActorRoleGuard], data: {expectedRole: 'anonymous'},
    canDeactivate: [LeaveFormGuard]},
  ]
},

{path: 'trips', children:[
  {path: 'new', component: TripFormComponent, canActivate: [ActorRoleGuard], 
  data: {expectedRole: 'manager'}},
  {path: 'dt', component: TripTableComponent},
  {path: ':id/stages', component: StageComponent},
  {path: ':id/edit', component: TripFormComponent},
  {path: ':id', component: TripDisplayComponent},
  {path: '', component: TripListComponent}
  
]},

{path: 'stages', component: StageComponent},
{path: 'applies', component: ApplyComponent},
{path: 'payments', component: PaymentComponent},

{path: 'sponsorships', component: SponsorTableComponent},

{path: 'denied-access', component: DeniedAccessComponent},
{path: '', redirectTo: '/trips', pathMatch: 'full'},
{path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
