import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelContactoComponent } from './panel-contacto.component';

describe('PanelContactoComponent', () => {
  let component: PanelContactoComponent;
  let fixture: ComponentFixture<PanelContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
