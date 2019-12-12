import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupPage } from './setup.page';

const routes: Routes = [
  {
    path: '',
    component: SetupPage
  },
  {
    path: 'apartment',
    loadChildren: () => import('./apartment/apartment.module').then( m => m.ApartmentPageModule)
  },
  {
    path: 'apartmentdetails/:id',
    loadChildren: () => import('./apartmentdetails/apartmentdetails.module').then( m => m.ApartmentdetailsPageModule)
  },
  {
    path: 'roomtype',
    loadChildren: () => import('./roomtype/roomtype.module').then( m => m.RoomtypePageModule)
  },
  {
    path: 'roomtypedetails/:id',
    loadChildren: () => import('./roomtypedetails/roomtypedetails.module').then( m => m.RoomtypedetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupPageRoutingModule {}
