import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomtypedetailsPage } from './roomtypedetails.page';

const routes: Routes = [
  {
    path: '',
    component: RoomtypedetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomtypedetailsPageRoutingModule {}
