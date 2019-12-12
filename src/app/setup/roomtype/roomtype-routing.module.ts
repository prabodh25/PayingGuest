import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomtypePage } from './roomtype.page';

const routes: Routes = [
  {
    path: '',
    component: RoomtypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomtypePageRoutingModule {}
