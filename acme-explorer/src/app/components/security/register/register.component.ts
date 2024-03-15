import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  roleList: string [];

  constructor(private authService: AuthService,
    private fb: FormBuilder, private router: Router) { 
      this.roleList = this.authService.getRoles();
      this.createForm();
    }

  createForm(){
    this.registrationForm = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      password: [''],
      phone: [''],
      address: [''],
      role: [''],
      validate: ['true']
    });
  }
   
  async onRegister() {
    try {
      const response = await this.authService.signUp(this.registrationForm.value);
      this.router.navigate(["/"]);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

}
