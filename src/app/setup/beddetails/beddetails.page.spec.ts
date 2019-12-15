import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BeddetailsPage } from './beddetails.page';

describe('BeddetailsPage', () => {
  let component: BeddetailsPage;
  let fixture: ComponentFixture<BeddetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeddetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BeddetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
