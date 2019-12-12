import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApartmentPage } from './apartment.page';

describe('ApartmentPage', () => {
  let component: ApartmentPage;
  let fixture: ComponentFixture<ApartmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApartmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
