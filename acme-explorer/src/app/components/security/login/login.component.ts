import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }


  async onLogin(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;
    try {
      const response = await this.authService.login(email, password);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

}
