import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, query, where, updateDoc, addDoc } from '@angular/fire/firestore';
import { MessageService } from 'src/app/services/message.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentActor!: Actor;
  private loginStatus = new Subject<Boolean>();
  constructor(private auth: Auth, private http: HttpClient, private firestore: Firestore, private messageService: MessageService,) { }

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

  async createActor(actor: Actor) {
    const actorData = {
      email: actor.email,
      address: actor.address,
      name: actor.name,
      phone: actor.phone,
      role: actor.role,
      surname: actor.surname,
      validate: actor.validate,
      version: 1
    };
    await addDoc(collection(this.firestore, "actors"),actorData).then(async (docRef) => {
      console.log('Documento creado con ID:', docRef.id);
      //iniciamos sesion unicamente si se ha creado un explorer
      if(actor.role === "explorer") {
        await this.login(actor.email, actor.password);
      }
      
    })
    .catch((error) => {
      console.error('Error al crear documento:', error);
    });
  }

  getRoles(): string[] {
    return ['Anonymous', 'Manager', 'Administrator', 'Explorer', 'Sponsor']
  }

  async getActorById(actorId: string): Promise<Actor | null> {
    return new Promise<Actor | null>((resolve, reject) => {
      try {
        const actorRef = collection(this.firestore, 'actors');
        const docRef = doc(actorRef, actorId);
        getDoc(docRef)
          .then(doc => {
            if (doc.exists()) {
              const actor = this.getActor(doc);
              resolve(actor);
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            reject(err);
          });
      } catch (error) {
        console.error('Error al obtener el actor por ID:', error);
        reject(error);
      }
    });
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
            //guardar actor en sesionStorage
            this.setCurrentActor(actor);
            this.setUser(actor);
            this.loginStatus.next(true);
            this.messageService.notifyMessage('', 'alert alert-danger');
          resolve(actor);
        }else{
          console.log("No se encontró un actor con ese correo electrónico.");
        }})
      .catch(err => {
        console.error('Error al buscar el actor:', err);
        reject(err); 
        let message = $localize `User or password incorrect`;
        this.messageService.notifyMessage(message, 'alert alert-danger');
      });
    })
  }

  setCurrentActor(actor?: Actor){
    if(actor){
      sessionStorage.setItem('currentActor', JSON.stringify({
        id: actor.id,
        name: actor.name,
        surname: actor.surname,
        role: actor.role
      }))
    } else {
      sessionStorage.removeItem('currentActor');
    }
  }

  getCurrentActor(): Actor{
    let result = null;
    const currentActor = sessionStorage.getItem('currentActor');
    if(currentActor){
      result = JSON.parse(currentActor);
      this.currentActor = result;
    } else {
      let message = $localize `User mode is anonymous`;
      this.messageService.notifyMessage(message, 'alert alert-warning');
    }
    return result;
  }

  setUser(actor: any) {
    sessionStorage.setItem('actor', JSON.stringify(actor));
  }

  getUser() {
    const actor = sessionStorage.getItem('actor');
    if (actor) return JSON.parse(actor);
    else return actor;
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

  getStatus(): Observable<Boolean>{
    return this.loginStatus.asObservable();
  }

  async logout() {
    return new Promise<any>((resolve, reject) =>{
      signOut(this.auth)
      .then(response =>{
        this.setCurrentActor();
        sessionStorage.clear();
        this.loginStatus.next(false)
        console.log('¡Ha cerrado sesión correctamente en Firebase!', response);
        resolve(response);
      }).catch(error =>{
        console.log('Error al cerrar sesion',error);
        reject(error);
      })
    })
  }

  checkRole(roles: string): boolean{
    let result = false;
    const currentActor = this.getCurrentActor();
    if(currentActor){
      if(roles.indexOf(currentActor.role.toString().toUpperCase()) !== -1){
        result = true;
      }else{
        result = false;
      } 
    } else {
      result = roles.indexOf('ANONYMOUS') !== -1;
    }
    return result;
  }

  async updateActor(newData: any, actorId: string) {
    try {
      await updateDoc(doc(this.firestore, 'actors', actorId), newData);
      console.log("Actor actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el actor:", error);
      throw error;
    }
  }
  
}
