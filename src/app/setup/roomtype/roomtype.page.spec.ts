import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomtypePage } from './roomtype.page';

describe('RoomtypePage', () => {
  let component: RoomtypePage;
  let fixture: ComponentFixture<RoomtypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomtypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomtypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
