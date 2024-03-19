import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
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
  private currentActor!: Actor;
  private loginStatus = new Subject<Boolean>();
  constructor(private auth: Auth, private http: HttpClient) { }

  async signUp(actor: Actor){
    try{
        const res = await createUserWithEmailAndPassword(this.auth, actor.email, actor.password)
        console.log('¡Se ha registrado correctamente en Firebase!', res);
        return res; 
    }catch (err) {
      console.log('Error al registrarse',err);
      throw err;
    }
    
  }

  getRoles(): string[] {
    return ['Anonymous', 'Manager', 'Administrator', 'Explorer', 'Sponsor']
  }

  async logout() {
    return new Promise<any>((resolve, reject) =>{
      signOut(this.auth)
      .then(response =>{
        this.loginStatus.next(false)
        console.log('¡Ha cerrado sesión correctamente en Firebase!', response);
        resolve(response);
      }).catch(error =>{
        console.log('Error al cerrar sesion',error);
        reject(error);
      })
    })
  }

  async login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve,reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
      .then(async _ => {
        const url = environment.backendApiBaseURL + `/actors?email=` + email;
        const actor = await firstValueFrom(this.http.get<Actor[]>(url));
        this.currentActor = actor[0];
        this.loginStatus.next(true);
        console.log('¡Inicio de sesión exitoso!');
        resolve(actor);
      })
      .catch(err => {
        console.error('Error al iniciar sesión:', err);
        reject(err); // Propaga el error para que el componente que llama pueda manejarlo
      });
    })
  }

  async deleteCurrentUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await user.delete();
        console.log('Usuario eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
      }
    }
  }

  getCurrentActor(): Actor {
    return this.currentActor;
  }

  getStatus(): Observable<Boolean>{
    return this.loginStatus.asObservable();
  }
}
