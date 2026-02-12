import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaConocenos } from './tarjeta-conocenos';

describe('TarjetaConocenos', () => {
  let component: TarjetaConocenos;
  let fixture: ComponentFixture<TarjetaConocenos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaConocenos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaConocenos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
