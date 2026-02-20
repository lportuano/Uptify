import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPlan } from './formulario-plan';

describe('FormularioPlan', () => {
  let component: FormularioPlan;
  let fixture: ComponentFixture<FormularioPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
