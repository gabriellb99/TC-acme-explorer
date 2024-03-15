// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loginError', [
      state('.horizontal', style({
        border: '1px solid red' // Cambia el borde del formulario a rojo cuando hay un error
      })),
      transition('* => show', [
        animate('0.5s')
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError = false; // Variable para controlar si se muestra el error de inicio de sesión

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  async onLogin(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;
    try {
      const response = await this.authService.login(email, password);
      console.log(response);
    } catch (error) {
      console.error(error);
      this.loginError = true; // Establece loginError en true cuando hay un error en el inicio de sesión
    }
  }
}
