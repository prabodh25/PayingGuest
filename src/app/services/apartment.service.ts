import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take, switchMap, mergeMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { apartment } from '../Interfaces/apartment';
import { Promise } from 'q';
import { address } from '../Interfaces/address';
import { phone } from '../Interfaces/phone';
import { apartmentType } from '../Interfaces/apartmentType';
import { del } from 'selenium-webdriver/http';

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
    //console.log("initializeApartmentTypes");
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
              this.afs.collection<address>('Address', ref => ref.where('ApartmentID', '==', apart.payload.ref)).snapshotChanges()
                .pipe(
                  map(addresses => {
                    const data = addresses[0].payload.doc.data() as address;
                    const id = addresses[0].payload.doc.id;
                    return { id, ...data };
                  })
                )
            ),
            combineLatest(
              this.afs.doc<apartmentType>(apart.payload.data().Type).snapshotChanges()
                .pipe(
                  map(atype => {
                    //console.log(atype.payload.id);
                    const data = atype.payload.data() as apartmentType;
                    const id = atype.payload.id;
                    return { id, ...data };
                  })
                )
            ),
            combineLatest(
              this.afs.collection<phone>('Phone', ref => ref.where('ApartmentID', '==', apart.payload.ref)).snapshotChanges()
                .pipe(
                  map(phones => {
                    const data = phones[0].payload.doc.data() as phone;
                    const id = phones[0].payload.doc.id;
                    return { id, ...data };
                  })
                )
            )
          )
        }),
        map(([apart, add, room, phn]) => {
          //console.log(add);
          return {
            apartment: apart.payload.data(),
            address: add[0],
            apartmenttype: room[0],
            phone: phn[0]
          }

        })
      );

  }

  createApartment(apartmentId: string, addressId: string, phoneId: string, obj: any) {
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

      let aptId = this.afs.createId();
      let addId = this.afs.createId();
      let phoneId = this.afs.createId();

      if (apartmentId == "new") {
        aptId = this.afs.createId();
        addId = this.afs.createId();
        phoneId = this.afs.createId();
      }
      else {
        aptId = apartmentId;
        addId = addressId;
        phoneId = phoneId;
      }
      return this.afs.doc(`Apartment/${aptId}`).set(objApartment)
        .then(rest => {
          const aptRef = this.afs.doc(`Apartment/${aptId}`).ref;
          //create address object
          const objAddress: address = {
            id: '',
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
            id: '',
            ApartmentID: aptRef,
            Home: 0,
            Office: 0,
            Phone1: obj.phone1,
            Phone2: obj.phone2,
            UserID: null,
            VendorID: null,
            IsDeleted: false,
            ModifiedDate: new Date()
          }
          delete objAddress.id;
          delete objPhone.id;

          combineLatest(
            this.afs.doc(`Address/${addId}`).set(objAddress),
            this.afs.doc(`Phone/${phoneId}`).set(objPhone)
          )
            .subscribe(res => resolve(true), err => console.log("sub error:" + err));
        })
        .catch(err => {
          console.log('error createApartment service');
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

    //console.log("getApartmentTypes");
    //console.log(this.aptType);
    return this.aptType;
  }
}
