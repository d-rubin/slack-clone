import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxMenuComponent } from './chatbox-menu.component';

describe('ChatboxMenuComponent', () => {
  let component: ChatboxMenuComponent;
  let fixture: ComponentFixture<ChatboxMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatboxMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatboxMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
