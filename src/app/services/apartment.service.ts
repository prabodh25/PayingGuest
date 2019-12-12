import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { apartment } from '../Interfaces/apartment';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private apt: Observable<apartment[]>;
  private apartmentCollection: AngularFirestoreCollection<apartment>;

  constructor(private afs: AngularFirestore) {
    try {
      this.apartmentCollection = afs.collection<apartment>('Apartment');
      this.apt = this.apartmentCollection.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as apartment;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }));
    } catch (error) {
      console.log(error);
    }
  }

  getApartments() {
    return this.apt;
  }

  getApartmentById(aptId: string) {
    return this.afs.collection('Apartment').doc<apartment>(aptId).valueChanges();
  }

  createApartment(objApartment: apartment) {
    const aptId = this.afs.createId();
    console.log("aptId: " + aptId);
    delete objApartment.id;
    return this.afs.doc(`Apartment/${aptId}`).set(objApartment);

  }
  getNewApartment():apartment{
    const apt:apartment = {
      id:'',
      ApartmentName:'',
      IsDeleted:false,
      ModifiedDate: new Date()
    }
    return apt;
  }
}
