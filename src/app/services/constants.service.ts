import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  readonly FIREBASE_COLLECTION_REGION:string = 'Region';
  readonly FIREBASE_COLLECTION_ZONE:string = 'Zone';
  readonly FIREBASE_COLLECTION_APARTMENT:string = 'Apartment';
  readonly FIREBASE_COLLECTION_BED:string = 'Beds';
  readonly FIREBASE_COLLECTION_USERS:string = 'Users';
  
}
