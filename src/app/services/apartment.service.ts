import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take, switchMap, mergeMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { apartment } from '../Interfaces/apartment';
import { Promise } from 'q';
import { address } from '../Interfaces/address';
import { phone } from '../Interfaces/phone';
import { apartmentType } from '../Interfaces/apartmentType';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private apt: Observable<apartment[]>;
  private aptType: Observable<apartmentType[]>;
  private apartmentCollection: AngularFirestoreCollection<apartment>;
  private apartmentTypeCollection: AngularFirestoreCollection<apartmentType>;

  constructor(private afs: AngularFirestore) {
    this.initializeApartments();
    this.initializeApartmentTypes();
  }

  initializeApartments() {
    this.apartmentCollection = this.afs.collection<apartment>('Apartment');
    this.apt = this.apartmentCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as apartment;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

  initializeApartmentTypes() {
    this.apartmentTypeCollection = this.afs.collection<apartmentType>('ApartmentType');
    this.aptType = this.apartmentTypeCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as apartmentType;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

  getApartments() {
    if (!this.apt)
      this.initializeApartments();
    return this.apt;
  }

  getApartmentById(aptId: string) {
    return this.afs.collection('Apartment').doc<apartment>(aptId).snapshotChanges()
      .pipe(
        switchMap(apart => {
          return combineLatest(
            of(apart),
            combineLatest(
              this.afs.collection<address>('Address', ref => ref.where('ApartmentID', '==', apart.payload.ref)).valueChanges()
                .pipe(
                  map(add => {
                    return add[0];
                  })
                )
            ),
            combineLatest(
              this.afs.doc<apartmentType>(apart.payload.data().Type).snapshotChanges()
                .pipe(
                  map(atype => {
                    console.log(atype.payload.id);
                    const data = atype.payload.data() as apartmentType;
                    const id = atype.payload.id;
                    return { id, ...data };
                  })
                )
            ),
            combineLatest(
              this.afs.collection<phone>('Phone', ref => ref.where('ApartmentID', '==', apart.payload.ref)).valueChanges()
                .pipe(
                  map(ph => {
                    return ph[0];
                  })
                )
            )
          )
        }),
        map(([apart, add, room, phn]) => {
          return {
            apartment: apart.payload.data(),
            address: add[0],
            apartmenttype: room[0],
            phone: phn[0]
          }

        })
      );

  }

  createApartment(obj: any) {
    return Promise<Boolean>((resolve, reject) => {
      //get apartment type doc reference
      const objAptType = obj.apartmentType;
      const aptDocRef = this.afs.collection<apartmentType>('ApartmentType').doc(objAptType.id).ref;
      //Create apartment object
      const objApartment: apartment = {
        id: '',
        ApartmentName: obj.apartmentName,
        Type: aptDocRef,
        IsDeleted: false,
        ModifiedDate: new Date()
      }

      delete objApartment.id;

      const aptId = this.afs.createId();
      const addId = this.afs.createId();
      const phoneId = this.afs.createId();

      return this.afs.doc(`Apartment/${aptId}`).set(objApartment)
        .then(rest => {
          const aptRef = this.afs.doc(`Apartment/${aptId}`).ref;
          //create address object
          const objAddress: address = {
            AddressType: 'A',
            ApartmentID: aptRef,
            Line1: obj.address1,
            Line2: obj.address2,
            Line3: obj.address3,
            State: obj.state,
            City: obj.city,
            PIN: obj.pin,
            UserID: null,
            VendorID: null,
            IsDeleted: false,
            ModifiedDate: new Date()
          }
          //create phone object
          const objPhone: phone = {
            ApartmentID: aptDocRef,
            Home: 0,
            Office: 0,
            Phone1: obj.phone1,
            Phone2: obj.phone2,
            UserID: null,
            VendorID: null,
            IsDeleted: false,
            ModifiedDate: new Date()
          }

          combineLatest(
            this.afs.doc(`Address/${addId}`).set(objAddress),
            this.afs.doc(`Phone/${phoneId}`).set(objPhone)
          )
          .subscribe(res => resolve(true));
        })
        .catch(err => {
          console.log(err);
          reject(false);
        })
    });


  }

  getNewApartment(): apartment {
    const apt: apartment = {
      id: '',
      Type: '',
      ApartmentName: '',
      IsDeleted: false,
      ModifiedDate: new Date()
    }
    return apt;
  }

  getApartmentTypes() {
    if (!this.aptType)
      this.initializeApartmentTypes();

    console.log(this.aptType);
    return this.aptType;
  }
}
