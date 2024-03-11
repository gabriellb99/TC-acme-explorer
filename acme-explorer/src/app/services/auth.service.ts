import { Injectable } from '@angular/core';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AuthService, private http: HttpClient) { }

  singUp(actor:Actor){
    createUserWithEmailAndPassword(this.auth.actor.email, actor.password).then(async res => {
      console.log('¡Se ha registrado correctamente en Firebase!',res);
      const url = `${environment.backendApiBaseURL + /actors}`;
      const body = JSON.stringify(actor);
      const response = await firstValueFrom(this.http.post(url, body, httpOptions))
      console.log(response);
    })
  }

  getRoles(): string[] {
    return ['CLERK', 'ADMINISTRATOR', 'CONSUMER']
  }
}
