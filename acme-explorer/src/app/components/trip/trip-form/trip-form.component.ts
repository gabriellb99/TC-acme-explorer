import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {

  newTripForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.newTripForm = this.fb.group({
      title: [''],
      description: [''],
      startedAt: ['', [Validators.required, this.dateGreaterThanToday.bind(this)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const formModel = this.newTripForm.value;
    this.router.navigate(['/trips']);

    if (formModel.title == "") {
      console.log("error por titulo vacio");
    }

    if (formModel.description == "") {
      console.log("error por descripcion vacio");
    }
  }

  // Función de validación personalizada para verificar si la fecha es posterior al día de hoy
  dateGreaterThanToday(control: AbstractControl): {[key: string]: any} | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    if (selectedDate < today) {
      return { 'dateInvalid': true };
    }
    return null;
  }
}
