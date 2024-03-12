import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Actor } from './../../../models/actor.model';  

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule ],
      providers: [ AuthService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.signUp() on registration', async () => {
    const actorData = { 
      email: 'test@example.com',
      password: 'password',
      name: 'John',
      surname: 'Doe',
      phone: '123456789',
      address: '123 Main St',
      role: 'user',
      validate: true
    };

    spyOn(console, 'log');

    const signUpPromise = authService.signUp(actorData as Actor); // Convertir a tipo Actor

    // Simular la creación de usuario con correo electrónico y contraseña
    const signUpRequest = httpMock.expectOne(req => req.method === 'POST');
    expect(signUpRequest.request.body).toEqual(actorData);
    signUpRequest.flush({ success: true });

    // Esperar a que se resuelva la promesa
    await signUpPromise;

    // Verificar que se llamó a console.log() con la respuesta
    expect(console.log).toHaveBeenCalledWith('¡Se ha registrado correctamente en Firebase!', { success: true });
  });

  it('should handle error from authService.signUp()', async () => {
    const actorData = { 
      email: 'test@example.com',
      password: 'password',
      name: 'John',
      surname: 'Doe',
      phone: '123456789',
      address: '123 Main St',
      role: 'user',
      validate: true
    };

    spyOn(console, 'error');

    const signUpPromise = authService.signUp(actorData as Actor); // Convertir a tipo Actor

    // Simular un error en la creación de usuario con correo electrónico y contraseña
    const signUpRequest = httpMock.expectOne(req => req.method === 'POST');
    signUpRequest.error(new ErrorEvent('signup error'), { status: 500, statusText: 'Internal Server Error' });

     // Esperar a que se resuelva la promesa
     try {
      await signUpPromise;
    } catch (error) {
      // Verificar que se llamó a console.error() con el error
      expect(console.error).toHaveBeenCalledWith('signup error');
    }

    // Verificar que se llamó a console.error() con el error
    expect(console.error).toHaveBeenCalledWith('signup error');
  });
});
