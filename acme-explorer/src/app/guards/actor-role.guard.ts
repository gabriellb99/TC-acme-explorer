import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActorRoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
      Observable<boolean | UrlTree> 
      | Promise<boolean | UrlTree> 
      | boolean 
      | UrlTree {
        return new Promise ((resolve,reject) => {
          const expectedRole = router.data['expectedRole'];
          const currentActor = this.authService.getCurrentActor
        })
    return true;
  }
  
}
