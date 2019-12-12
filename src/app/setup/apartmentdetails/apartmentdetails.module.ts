import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApartmentdetailsPageRoutingModule } from './apartmentdetails-routing.module';

import { ApartmentdetailsPage } from './apartmentdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApartmentdetailsPageRoutingModule
  ],
  declarations: [ApartmentdetailsPage]
})
export class ApartmentdetailsPageModule {}
