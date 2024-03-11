import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';
import {Auth, createUserWithEmailAndPassword} from '@angular/fire/auth';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private http: HttpClient) { }

  singUp(actor:Actor){
    createUserWithEmailAndPassword(this.auth,String(actor.email), String(actor.password)).then(async res => {
      console.log('¡Se ha registrado correctamente en Firebase!',res);
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      const body = JSON.stringify(actor);
      const response = await firstValueFrom(this.http.post(url, body, httpOptions))
      console.log(response);
      return response;
    })
  }

  getRoles(): string[] {
    return ['CLERK', 'ADMINISTRATOR', 'CONSUMER']
  }
}
