import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterComponent } from '../components/security/register/register.component';
import { FormValidation } from '../models/form-validation';

@Injectable({
  providedIn: 'root'
})
export class LeaveFormGuard implements CanDeactivate<FormValidation> {
  canDeactivate(
    component: FormValidation,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.isFormValid() ? true: window.confirm('Do yo want to discard changes?');
  }
  
}
