import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFilesComponent } from './preview.files.component';

describe('PreviewFilesComponent', () => {
  let component: PreviewFilesComponent;
  let fixture: ComponentFixture<PreviewFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
