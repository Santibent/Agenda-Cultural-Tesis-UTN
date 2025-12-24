import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFlyers } from './gestion-flyers';

describe('GestionFlyers', () => {
  let component: GestionFlyers;
  let fixture: ComponentFixture<GestionFlyers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFlyers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionFlyers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
