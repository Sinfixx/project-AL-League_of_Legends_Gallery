import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponNew } from './weapon-new';

describe('WeaponNew', () => {
  let component: WeaponNew;
  let fixture: ComponentFixture<WeaponNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponNew],
    }).compileComponents();

    fixture = TestBed.createComponent(WeaponNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
