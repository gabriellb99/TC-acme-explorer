import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidation } from 'src/app/models/form-validation';
import { Actor } from 'src/app/models/actor.model';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements FormValidation, OnInit {

  registrationForm!: FormGroup;
  roleList: string[] = [];
  private formSubmitted = false;
  isFormValid = () => this.formSubmitted || this.registrationForm?.dirty;
  actorId: any;
  editing: boolean = false;
  public actor!: Actor;
  role: string = "explorer";
  isAdministrator: boolean = false;
  passwordIsValid: boolean = true;
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;

  constructor(private timeTracker: TimeTrackerService, private route: ActivatedRoute, private authService: AuthService,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor){
    this.idUser = this.currentActor.id;
  }

    this.roleList = this.authService.getRoles();
      
    if (this.authService.getUser()?._role === "administrator") {
      this.role = "manager";
    }
    else {
      this.role = "explorer";
    }

    this.actorId = this.route.snapshot.params['id'];
    if (this.actorId) {
      this.loadActor();
    } else {
      this.createForm();
    }
  }

  async loadActor() {
    const actor = await this.authService.getActorById(this.actorId);
    if (actor) {
      this.editing = true;
      this.actor = actor;
      this.registrationForm = this.fb.group({
        name: [actor.name, Validators.required],
        surname: [actor.surname, Validators.required],
        email: [actor.email, [Validators.required, Validators.email]],
        //password: [actor.password, [Validators.required]],
        phone: [actor.phone],
        address: [actor.address],
        role: [actor.role],
        validate: true
      });
      console.log('Displaying actor:' + actor);
    } else {
      console.error('No se encontró ningún actor con el ID proporcionado.');
    }
  }

  createForm() {
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
    if (!this.editing) {
      if (this.registrationForm.controls['password'].value.length < 6) {
        this.passwordIsValid = false;
        this.registrationForm.controls['password'].setErrors({ 'minlength': true });
        return; 
      }
    }
    if (this.editing) {
      await this.authService.updateActor(this.registrationForm.value, this.actorId);
      this.router.navigate(["/"]);
    } else {
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
  ngOnDestroy(): void {
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  }
}
