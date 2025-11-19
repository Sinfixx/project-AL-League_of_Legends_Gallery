import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroNew } from './hero-new';

describe('HeroNew', () => {
  let component: HeroNew;
  let fixture: ComponentFixture<HeroNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
