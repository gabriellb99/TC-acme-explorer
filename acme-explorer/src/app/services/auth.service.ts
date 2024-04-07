import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentActor!: Actor;
  private loginStatus = new Subject<Boolean>();
  constructor(private auth: Auth, private http: HttpClient, private firestore: Firestore) { }

  async signUp(actor: Actor){

    return new Promise<any>((resolve, reject) =>{
      createUserWithEmailAndPassword(this.auth, actor.email, actor.password)
      .then(response =>{
        console.log('¡Se ha registrado correctamente en Firebase!', response);
        resolve(response);
      }).catch(error =>{
        console.log('Error al registrarse',error);
        reject(error);
      })
    })
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

  public getActor(doc: any): Actor {
    const data = doc.data();
    let actor = new Actor();
    actor.name = data['name'];
    actor.surname = data['surname'];
    actor.email = data['email'];
    actor.phone = data['phone'];
    actor.address = data['address'];
    actor.role = data['role'];
    actor.validate = data['validate'];
    actor.id = doc.id;
    console.log(actor);
    return actor;
  }

  async login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve,reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
      .then(async _ => {
        const actorRef = collection(this.firestore, 'actors');
        const q = query(actorRef,where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const actorDoc = querySnapshot.docs[0];
            let actor = this.getActor(actorDoc);
            this.currentActor = actor;
            this.loginStatus.next(true);
        
          resolve(actor);
        }else{
          console.log("No se encontró un actor con ese correo electrónico.");
        }})
      .catch(err => {
        console.error('Error al buscar el actor:', err);
        reject(err); 
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

  checkRole(roles: string): boolean{
    let result = false;
    if(this.currentActor){
      result = roles.indexOf(this.currentActor.role.toString().toUpperCase()) !== -1; 
    } else {
      result = roles.indexOf('ANONYMOUS') !== -1;
    }
    return result;
  }
  
}
