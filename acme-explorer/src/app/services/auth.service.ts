import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private auth: Auth, private http: HttpClient) { }

  signUp(actor: Actor){
    createUserWithEmailAndPassword(this.auth, actor.email, actor.password).then(async res => {
      console.log('¡Se ha registrado correctamente en Firebase!', res);
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      const body = JSON.stringify(actor);
      const response = await firstValueFrom(this.http.post(url, body, httpOptions));
      console.log(response);
      return(response)
    })
  }

  getRoles(): string[] {
    return ['CLERK', 'ADMINISTRATOR', 'CONSUMER']
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error(error);
    }
}
  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(response => {
        console.log('¡Inicio de sesión exitoso!', response);
        return response;
      })
      .catch(err => {
        console.error('Error al iniciar sesión:', err);
        throw err; // Propaga el error para que el componente que llama pueda manejarlo
      });
  }
}
