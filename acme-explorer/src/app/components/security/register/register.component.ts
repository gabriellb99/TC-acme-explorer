import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  roleList: string [];

  constructor(private authService: AuthService,
    private fb: FormBuilder) { 
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
      validated: ['true']
    });
  }
   
  async onRegister() {
    try {
      const response = await this.authService.signUp(this.registrationForm.value);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
}

}
