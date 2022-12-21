import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainareaComponent } from './mainarea.component';

describe('MainareaComponent', () => {
  let component: MainareaComponent;
  let fixture: ComponentFixture<MainareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
