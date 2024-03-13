import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { Actor } from "src/app/models/actor.model";
import { AuthService } from "src/app/services/auth.service";
import { HttpClientModule } from "@angular/common/http";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from "src/environments/environment";
import { getAuth, provideAuth } from "@angular/fire/auth";

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {await TestBed.configureTestingModule({
        declarations: [HeaderComponent],
        providers: [AuthService],
        imports: [HttpClientModule,  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
            provideAuth(() => getAuth())]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

it('should create', () => {
    expect(component).toBeTruthy();
});

it('should register a new user', async () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const actor = new Actor('Paula', 'Prueba', 'paula@example.com', 'password123', '689654232', '123 Main St', 'CONSUMER', true);
    const userCreated = await authService.signUp(actor);
    expect(userCreated).toBeTruthy(); 
});

it('should not register an user with same email', async () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const actor = new Actor('Paula', 'Prueba', 'paula@example.com', 'password123', '689654232', '123 Main St', 'CONSUMER', true);
    try {
        await authService.signUp(actor);
        fail('Se esperaba que el registro no fuera exitoso debido a un correo electrónico en uso');
    } catch (error: any) {
        expect(error.message).toContain('auth/email-already-in-use');
    }
});

it('should login an existing user', async () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const email = 'paula@example.com';
    const password = 'password123';
    const userLogin = await authService.login(email, password);
    expect(userLogin).toBeTruthy(); 
});

it('should not login with non existing user', async () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const email = 'paulaFake@example.com';
    const password = 'password123';
    try {
        await authService.login(email, password);
        fail('Se esperaba que el inicio de sesión no fuera exitoso debido a que las credenciales son incorrectas');
    } catch (error: any) {
        expect(error.message).toContain('auth/invalid-login-credentials');
    }
});

it('should logout a logged-in user', async () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const userLogout = await authService.logout();
    expect(userLogout).toBeUndefined(); 
});

});


    
  
