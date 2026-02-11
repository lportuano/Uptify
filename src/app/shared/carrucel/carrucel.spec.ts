import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carrucel } from './carrucel';

describe('Carrucel', () => {
  let component: Carrucel;
  let fixture: ComponentFixture<Carrucel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carrucel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carrucel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
