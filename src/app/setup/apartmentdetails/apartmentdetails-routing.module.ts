import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApartmentdetailsPage } from './apartmentdetails.page';

const routes: Routes = [
  {
    path: '',
    component: ApartmentdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApartmentdetailsPageRoutingModule {}
