import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { RegisterComponent } from './components/security/register/register.component';
import { LoginComponent } from './components/security/login/login.component';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { HeaderComponent } from './components/master/header/header.component';
import { AuthService } from './services/auth.service';
import { MasterPageComponent } from './components/master/master-page/master-page.component';
import { FooterComponent } from './components/master/footer/footer.component';
import { TripListComponent } from './components/trip/components/trip/trip-list/trip-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApplyComponent } from './components/trip/apply/apply.component';
import { StageComponent } from './components/trip/stage/stage.component';
import { PaymentComponent } from './components/trip/payment/payment.component';
import { DeniedAccessComponent } from './components/shared/denied-access/denied-access.component';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    TripDisplayComponent,
    RegisterComponent,
    LoginComponent,
    NotFoundComponent,
    HeaderComponent,
    MasterPageComponent,
    FooterComponent,
    TripListComponent,
    DashboardComponent,
    ApplyComponent,
    StageComponent,
    PaymentComponent,
    DeniedAccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
