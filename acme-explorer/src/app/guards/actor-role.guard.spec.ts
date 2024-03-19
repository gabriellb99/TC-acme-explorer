import { TestBed } from '@angular/core/testing';

import { ActorRoleGuard } from './actor-role.guard';

describe('ActorRoleGuard', () => {
  let guard: ActorRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActorRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
