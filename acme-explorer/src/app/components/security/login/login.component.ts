// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loginError', [
      state('show', style({
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
  private returnUrl!: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onLogin(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;
      this.authService.login(email, password)
      .then(_ => {
        form.reset();
        this.router.navigateByUrl(this.returnUrl);
      }).catch( (error) => {
      console.error(error);
      this.loginError = true; // Establece loginError en true cuando hay un error en el inicio de sesión
    })
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
