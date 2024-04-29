import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidation } from 'src/app/models/form-validation';
import { Actor } from 'src/app/models/actor.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements FormValidation{

  registrationForm!: FormGroup;
  roleList: string [];
  private formSubmitted = false;
  isFormValid = () => this.formSubmitted || this.registrationForm?.dirty;
  actorId: any;
  editing: boolean = false;
  public actor!: Actor;
  role: string = "explorer";
  isAdministrator: boolean = false;
  passwordIsValid: boolean = true;

  constructor(private route: ActivatedRoute, private authService: AuthService,
    private fb: FormBuilder, private router: Router) { 
      this.roleList = this.authService.getRoles();
      
      if (authService.getUser()?._role === "administrator") {
        this.role = "manager";
      }
      else {
        this.role = "explorer";
      }

      this.actorId = route.snapshot.params['id'];
    (async () => {
        if (this.actorId) {
          const actor = await this.authService.getActorById(this.actorId);
          if(actor){
            this.editing = true;
            this.actor = actor;
            this.registrationForm = this.fb.group({
              name: [actor.name, Validators.required],
              surname: [actor.surname, Validators.required],
              email: [actor.email, [Validators.required, Validators.email]],
              password: [actor.password, [Validators.required]],
              phone: [actor.phone],
              address: [actor.address],
              role: [actor.role],
              validate: true
            });
            console.log('Displaying actor:' + actor);
          }else{
            console.error('No se encontró ningún actor con el ID proporcionado.');
          }
      }else{
        this.createForm();
      }
    });
  }


  createForm(){
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: [''],
      address: [''],
      role: this.role,
      validate: true
    });
  }
   
  async onRegister() {
    this.formSubmitted = true;
    if (this.registrationForm.controls['password'].value.length< 6) {
      this.passwordIsValid = false;
      this.registrationForm.controls['password'].setErrors({ 'minlength': true });
      return; 
    }
    if(this.editing){
      await this.authService.updateActor(this.registrationForm.value, this.actorId);
      this.router.navigate(["/"]);
    }else{
      try {
        const response = await this.authService.signUp(this.registrationForm.value);
        const response2 = await this.authService.createActor(this.registrationForm.value);
        this.router.navigate(["/"]);
        console.log(response);
        console.log(response2);
      } catch (error) {
        console.error(error);
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
