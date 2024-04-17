import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/models/trip.model';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {

  newTripForm: FormGroup;
  randoms: number[] = [1, 2, 3];
  tripId!: any;
  
  constructor(
    //public toastService: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    public tripService: TripService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.tripId = this.activatedRoute.snapshot.params['id'];
    this.newTripForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startAt: new FormControl(null, [Validators.required, this.dateGreaterThanToday]),
      endAt: new FormControl(null, [Validators.required, this.dateGreaterThanToday]),
      requirements: new FormArray(
        [new FormControl(null)],
        [Validators.required]
      ),
      cancelReason: new FormControl(null),      
      status: new FormControl(null),
      ticker: new FormControl(null),
      photos: new FormArray(
        [new FormControl(null)]
      ),
      price: new FormControl(null, [Validators.required, this.priceGreaterThanCero]),
      stages: new FormArray(
        [
          new FormGroup({
            title: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            price: new FormControl(null, [Validators.required]),
          }),
        ],
        [Validators.required]
      ),
    });


    this.newTripForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startAt: new FormControl(null, [Validators.required, this.dateGreaterThanToday]),
      endAt: new FormControl(null, [Validators.required, this.dateGreaterThanToday]),
      requirements: new FormArray(
        [new FormControl(null)],
        [Validators.required]
      ),
      cancelReason: new FormControl(null),  
      status: new FormControl(null),
      ticker: new FormControl(null),
      photos: new FormArray([new FormControl(null)]),     
      price: new FormControl(null, [Validators.required, this.priceGreaterThanCero]),
      stages: new FormArray(
        [
          new FormGroup({
            title: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            price: new FormControl(null, [Validators.required]),
          }),
        ],
        [Validators.required]
      ),
    });
    
  }



  ngOnInit(): void { }

  newTicker(): string {
    let ticker = '';
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Añadir un cero delante si es necesario
    const day = ('0' + currentDate.getDate()).slice(-2); // Añadir un cero delante si es necesario

    let randomLetters = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      randomLetters += letters[randomIndex];
    }

    ticker = `${year}${month}${day}-${randomLetters}`;
    return ticker;
  }

  onSubmit() {

    console.log("inicio submit");

    let loginUser: any = this.authService.getCurrentActor();
    let price = 0;
    const ticket = this.newTicker(); // Generar el ticket solo al crear un nuevo viaje
    const requirements = null;

    // Creamos una nueva instancia de Trip
    const newTrip = new Trip();

    // Establecemos las propiedades de la nueva instancia de Trip según los datos del formulario
    newTrip.ticker = this.newTicker(); // Asumiendo que ticket es generado de alguna manera
    newTrip.title = this.newTripForm.value.title;
    newTrip.description = this.newTripForm.value.description;
    newTrip.price = price;
    newTrip.startedAt = Timestamp.fromDate(new Date());
    newTrip.endAt = Timestamp.fromDate(new Date());
    /*const photosValidation = this.newTripForm.value.photos.filter((p:any) => {
      return p !== null && p.trim() !== "";
    });*/
    newTrip.photos = this.newTripForm.value.photos;
    console.log("onSubmit-this.newTripForm.value.requirements: ", this.newTripForm.value.requirements);
    newTrip.requirements = this.newTripForm.value.requirements; 


    this.tripService.createTrip(newTrip).then((_res) => {
      let msg = $localize`Trip created successfully`
      let msg2 = $localize`Success`
      //this.toastService.success(msg, msg2);
      this.router.navigate(['/']);
      console.log('OnSubmit-trip created');
    })
      .catch((error) => {
        let msg = $localize`Error on create trip`
        //this.toastService.error(msg, 'Error');
        console.log(error);
      });
  }

  get requirements() {
    this.newTripForm
      .get('requirements')
      ?.setValidators(Validators.required);
    return this.newTripForm.get('equirements') as FormArray;
  }

  get stages() {
    return this.newTripForm.get('stages') as FormArray;
  }

  get photos() {
    return this.newTripForm.get('photos') as FormArray;
  }  

  addPhoto() {
    console.log("addPhoto: ", this.newTripForm.get('photos'));
    (<FormArray>this.newTripForm.get('photos')).push(
      new FormControl(null)
    );
  }

  addRequirement() {
    (<FormArray>this.newTripForm.get('requirements')).push(
      new FormControl(null, Validators.required)
    );
  }

  addStage() {
    (<FormArray>this.newTripForm.get('stages')).push(
      new FormGroup({
        title: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
        price: new FormControl(null, [Validators.required]),
      })
    );
  }

  removePhotos(i: number) {
    let photosArray = this.newTripForm.get('photos') as FormArray;
    photosArray.removeAt(i);
  }

  removeRequirement(i: number) {
    let reqArray = this.newTripForm.get('requirements') as FormArray;
    reqArray.removeAt(i);
  }

  removeStage(i: number) {
    let stageArrray = this.newTripForm.get('stages') as FormArray;
    stageArrray.removeAt(i);
  }

  // Función de validación personalizada para verificar si la fecha es posterior al día de hoy
  dateGreaterThanToday(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    if (selectedDate < today) {
      return { 'dateInvalid': true };
    }
    return null;
  }

  priceGreaterThanCero(control: AbstractControl): { [key: string]: any } | null {
    const selectedPrice = control.value;    
    if (selectedPrice <= 0 ) {
      return { 'invalidPrice': true };
    }
    return null;
  }

  validateTripDates(trip: any) {
    let firstDate = new Date(trip.start_date);
    let finalDate = new Date();
    let diferencia_ms = firstDate.getTime() - finalDate.getTime();
    let dias = Math.ceil(diferencia_ms / (1000 * 60 * 60 * 24));
    if (dias <= 10) {
      return true
    }
    return false;
  }

  endDateValidator = (control: FormControl) => {
    const startDate = new Date(this.newTripForm?.get('startAt')?.value);
    const endDate = new Date(control.value);

    if (startDate >= endDate) {
      return {end_date: true};
    }

    return null;
  };

  startDateValidator = (control: FormControl) => {
    const startDate = new Date(control.value);
    const now = new Date();

    if (startDate <= now) {
      return {start_date: true};
    }

    return null;
  };

}
