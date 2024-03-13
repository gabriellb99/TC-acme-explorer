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

@NgModule({
  declarations: [
    AppComponent,
    TripDisplayComponent,
    RegisterComponent,
    LoginComponent,
    NotFoundComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
