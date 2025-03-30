import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptAreaComponent } from './prompt-area.component';
import {MatCardModule} from '@angular/material/card';

describe('PromptAreaComponent', () => {
  let component: PromptAreaComponent;
  let fixture: ComponentFixture<PromptAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
