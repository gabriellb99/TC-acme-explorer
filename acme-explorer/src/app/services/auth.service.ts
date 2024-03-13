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
    return ['CLERK', 'ADMINISTRATOR', 'CONSUMER']
  }

  async logout() {
    try {
      const res = await signOut(this.auth);
      console.log('¡Ha cerrado sesión correctamente en Firebase!', res);
      return res;
    } catch (error) {
      console.log('Error al cerrar sesion',error);
      return error;
    }
  }
  async login(email: string, password: string): Promise<any> {
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
}
