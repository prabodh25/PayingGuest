import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference, SnapshotOptions } from '@angular/fire/firestore';
import { map, take, switchMap, mergeMap } from 'rxjs/operators';
import { Observable, combineLatest, of, from, pipe } from 'rxjs';
import { apartment } from '../Interfaces/apartment';
import { Promise } from 'q';
import { address } from '../Interfaces/address';
import { phone } from '../Interfaces/phone';
import { apartmentType } from '../Interfaces/apartmentType';
import { del } from 'selenium-webdriver/http';
import { ConstantsService } from './constants.service';
import { bed } from '../Interfaces/bed';
import { users } from '../Interfaces/user';
import { dashboardItem } from '../Interfaces/dashboardItem';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private apt: Observable<apartment[]>;
  private aptType: Observable<apartmentType[]>;
  private apartmentCollection: AngularFirestoreCollection<apartment>;
  private apartmentTypeCollection: AngularFirestoreCollection<apartmentType>;

  constructor(private afs: AngularFirestore, private constants: ConstantsService) {
    this.initializeApartments();
    this.initializeApartmentTypes();
  }

  initializeApartments() {
    this.apartmentCollection = this.afs.collection<apartment>(this.constants.FIREBASE_COLLECTION_APARTMENT);
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

  createApartments() {

    this.afs.doc('Region/04OcJ9p2x11AJVltxOtZ/Zone/Ks4m03L3QSWlN6szc6Qg/Apartment/qKc3qdNY45XtzYebJKIO').get()
      .pipe(
        switchMap(apart => {
          const a = this.afs.collection(`Region/04OcJ9p2x11AJVltxOtZ/Zone/Ks4m03L3QSWlN6szc6Qg/Apartment/${apart.id}/Beds`).valueChanges()
            .pipe(
              map(beds => {
                console.log(beds);
                return {
                  apartment: apart.data(),
                  beds: beds
                }
              }
              )
            )
          return combineLatest(a);
        })
      )
      .subscribe(res => {
        console.log(res);
      })
  }

  getApartmentsByRegionZoneId(regionId: string, zoneId: string) {
    return this.afs.collection<apartment>(`${this.constants.FIREBASE_COLLECTION_REGION}/${regionId}/${this.constants.FIREBASE_COLLECTION_ZONE}/${zoneId}/${this.constants.FIREBASE_COLLECTION_APARTMENT}`).get()
      .pipe(
        mergeMap(apts => {
          //console.log(zones);
          const apart = apts.docs.map(apt => {
            const id = apt.id;
            const data = apt.data();
            const objApartment = {
              id,
              ...data
            } as apartment;
            
            if(objApartment.Partners.length == 0)
              objApartment.Partners.push('0');

            return combineLatest(
              of(objApartment),
              combineLatest(
                this.afs.collection<bed>(`${this.constants.FIREBASE_COLLECTION_REGION}/${regionId}/${this.constants.FIREBASE_COLLECTION_ZONE}/${zoneId}/${this.constants.FIREBASE_COLLECTION_APARTMENT}/${objApartment.id}/${this.constants.FIREBASE_COLLECTION_BED}`).get()
                  .pipe(
                    map(beds => {
                      console.log(beds.docs.length);
                      return {
                        bedCount: beds.docs.length
                      }
                    })
                  )
              ),
              combineLatest(
                this.afs.collection<users>(this.constants.FIREBASE_COLLECTION_USERS,
                  ref => ref.where('Uid', 'in', objApartment.Partners)).valueChanges()
                  .pipe(
                    map(usrs => {
                      return {
                        partners: usrs
                      }
                    })
                  )
              )
            ).pipe(
              map(([apart, beds, partners]) => {
                return {
                  apartment: apart,
                  beds: beds,
                  partners: partners
                }
              })
            )

          })

          return combineLatest(apart);
        }),
        map(items => {
          return items.map(item => {
            let partners: string[] = [];
            item.partners[0].partners.forEach(item => {
              partners.push(item.FirstName + ' ' + item.LastName)
            })
            return {
              id: item.apartment.id,
              ApartmentName: item.apartment.ApartmentName,
              BedCount: item.beds[0].bedCount,
              PartnerNames: partners,
              BankAccount: item.apartment.BankAccount
            } as dashboardItem
          })
        })
      )
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

  createApartment(apartmentId: string, obj: any) {
    return Promise<Boolean>((resolve, reject) => {
      //get apartment type doc reference

      const objApartment: apartment = {
        id: '',
        ApartmentName: obj.apartmentName,
        Type: obj.apartmentType.TypeName,
        IsDeleted: false,
        BankAccount: [],
        Partners: [],
        AddressLine1: obj.address1,
        AddressLine2: obj.address2,
        AddressLine3: obj.address3,
        State: obj.state,
        City:obj.city,
        PIN: obj.pin,
        Phones: []
      }

      objApartment.Phones.push(obj.phone1);
      objApartment.Phones.push(obj.phone2);

      delete objApartment.id;

      let aptId = this.afs.createId();

      if (apartmentId == "new") {
        aptId = this.afs.createId();
      }
      else {
        aptId = apartmentId;
      }

      return this.afs.doc(`Region/04OcJ9p2x11AJVltxOtZ/Zone/Ks4m03L3QSWlN6szc6Qg/Apartment/${aptId}`).set(objApartment)
        .then(rest => {
          console.log('success');
          resolve(true);
        })
        .catch(err => {
          console.log('error createApartment service');
          console.log(err);
          reject(false);
        })
    });


  }

  getApartmentTypes() {
    if (!this.aptType)
      this.initializeApartmentTypes();

    //console.log("getApartmentTypes");
    //console.log(this.aptType);
    return this.aptType;
  }

}
