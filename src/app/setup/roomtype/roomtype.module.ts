import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomtypePageRoutingModule } from './roomtype-routing.module';

import { RoomtypePage } from './roomtype.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomtypePageRoutingModule
  ],
  declarations: [RoomtypePage]
})
export class RoomtypePageModule {}
