import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeddetailsPageRoutingModule } from './beddetails-routing.module';

import { BeddetailsPage } from './beddetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeddetailsPageRoutingModule
  ],
  declarations: [BeddetailsPage]
})
export class BeddetailsPageModule {}
