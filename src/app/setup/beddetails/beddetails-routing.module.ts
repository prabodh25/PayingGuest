import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeddetailsPage } from './beddetails.page';

const routes: Routes = [
  {
    path: '',
    component: BeddetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeddetailsPageRoutingModule {}
