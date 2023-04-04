import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialequipoComponent } from './historialequipo.component';

describe('HistorialequipoComponent', () => {
  let component: HistorialequipoComponent;
  let fixture: ComponentFixture<HistorialequipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialequipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
