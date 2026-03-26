import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteError } from './reporte-error';

describe('ReporteError', () => {
  let component: ReporteError;
  let fixture: ComponentFixture<ReporteError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
