import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { ApplyService } from 'src/app/services/apply.service';
import { ApplyComponent } from './apply.component';
import { environment } from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/activatedroute-stub';
import { Application } from 'src/app/models/application.model';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Timestamp, getFirestore, provideFirestore } from '@angular/fire/firestore';


describe('ApplicationsComponent', () => {
  let component: ApplyComponent;
  let fixture: ComponentFixture<ApplyComponent>;
  let mockActivateRoute: ActivatedRouteStub;
  let getApplySpy: any;
  let authService: AuthService;
  let application1: Application;
  let application2: Application;
  let applications: Application[] = [];
  beforeEach(async () => {

    mockActivateRoute = new ActivatedRouteStub();
    mockActivateRoute.testParams = {id: 'NDssqtQO7CDDDJuX1VJt'};
    applications = [];

    application1 = new Application();
    application1.ticker = 'VI-123';
    application1.title = 'Punta Cana';
    application1.applictionStatus = 'pending';

    

    application2 = new Application();
    application2.ticker = 'VI-123';
    application2.title = 'Punta Cana';
    application2.applictionStatus = 'pending';

    applications.push(...[application1, application2]);
    console.log(applications);
    let applySpy = jasmine.createSpyObj('ApplyService', ['getAllApplications']);
    getApplySpy = applySpy.getAllApplications.and.returnValue(of(applications));

    await TestBed.configureTestingModule({
      declarations: [ApplyComponent],
      providers: [AuthService,  { provide: ApplyService, useValue: applySpy },
        { provide: ActivatedRoute, useValue: mockActivateRoute }],
            imports: [HttpClientModule,NgbModule,  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
                provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
    }).compileComponents();
    authService = TestBed.inject(AuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list the applications of a trip that has at least two applications', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card');
    console.log(cards.length)
    expect(cards.length>=2);
  });

  it('should list the applications of a trip that has no applications', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length==0);
  });
    
  
});
