import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { Actor } from "../models/actor.model";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClientModule } from "@angular/common/http";
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from "src/environments/environment";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";


describe('AuthService', () => {
    let authService: AuthService;
    let actor: Actor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthService],
            imports: [HttpClientModule,  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
                provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
        });
        authService = TestBed.inject(AuthService);

        
        actor = new Actor();
        actor.name = 'Paula';
        actor.surname = 'Prueba';
        actor.email = 'paula@example.com';
        actor.phone = '689654232';
        actor.password = 'password123';
        actor.phone = '689654232';
        actor.address = '123 Main St';
        actor.role = 'CONSUMER';
        actor.validate = true;

    });

    it('should be created', () => {
        expect(authService).toBeTruthy();
    });

    it('should register a new user', async () => {
        const userCreated = await authService.signUp(actor);
        expect(userCreated).toBeTruthy(); 
    });

    it('should not register an user with same email', async () => {
        try {
            await authService.signUp(actor);
            fail('Se esperaba que el registro no fuera exitoso debido a un correo electrónico en uso');
        } catch (error: any) {
            expect(error.message).toContain('auth/email-already-in-use');
        }
    });

    
    it('should login an existing user', async () => {
        const userLogin = await authService.login('paula@example.com', 'password123');
        expect(userLogin).toBeTruthy(); 
    });

    it('should logout a logged-in user', async () => {
        await authService.login('paula@example.com', 'password123');
        const userLogout = await authService.logout();
        expect(userLogout).toBeUndefined(); 
    });

    it('should not login with non existing user', async () => {
        try {
            await authService.login('paulaFake@example.com', 'password123');
            fail('Se esperaba que el inicio de sesión no fuera exitoso debido a que las credenciales son incorrectas');
        } catch (error: any) {
            expect(error.message).toContain('auth/invalid-login-credentials');
        }
    });

    afterAll(async () => {
        try {
            await authService.login('paula@example.com', 'password123');
            await authService.deleteCurrentUser();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    });
});
