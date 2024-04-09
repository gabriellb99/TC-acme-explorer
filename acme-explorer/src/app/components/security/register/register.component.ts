import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidation } from 'src/app/models/form-validation';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements FormValidation{

  registrationForm!: FormGroup;
  roleList: string [];
  private formSubmitted = false;
  isFormValid = () => this.formSubmitted || !this.registrationForm?.dirty

  constructor(private route: ActivatedRoute, private authService: AuthService,
    private fb: FormBuilder, private router: Router) { 
      this.roleList = this.authService.getRoles();
      this.createForm();
    }


  createForm(){
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      address: [''],
      role: [''],
      validate: ['true']
    });
  }
   
  async onRegister() {
    this.formSubmitted = true;
    try {
      const response = await this.authService.signUp(this.registrationForm.value);
      this.router.navigate(["/"]);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

}
