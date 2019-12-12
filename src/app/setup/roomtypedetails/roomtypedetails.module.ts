import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomtypedetailsPageRoutingModule } from './roomtypedetails-routing.module';

import { RoomtypedetailsPage } from './roomtypedetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomtypedetailsPageRoutingModule
  ],
  declarations: [RoomtypedetailsPage]
})
export class RoomtypedetailsPageModule {}
