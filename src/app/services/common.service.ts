import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConstantsService } from './constants.service';
import { region } from '../Interfaces/region';
import { regionZone } from '../Interfaces/zone';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private afs: AngularFirestore, private constant: ConstantsService) { }

  getRegions() {
    return this.afs.collection<region>(this.constant.FIREBASE_COLLECTION_REGION).get()
      .pipe(
        map(regs => {
          return regs.docs.map(reg => {
            const id = reg.id;
            const data = reg.data();
            const objRegion:region={
              id:id,
              RegionName: data.RegionName,
              IsDeleted: data.IsDeleted,
              ModifiedDate: data.ModifiedDate
            }
            return objRegion;
          })
        })
      )
  }

  getZonesByRegionId(regionId: string) {
    //console.log(`${this.constant.FIREBASE_COLLECTION_REGION}/${regionId}/${this.constant.FIREBASE_COLLECTION_ZONE}`);
    
    //return this.afs.collection(this.constant.FIREBASE_COLLECTION_REGION).doc(regionId).collection(this.constant.FIREBASE_COLLECTION_ZONE).get()
    return this.afs.collection(`${this.constant.FIREBASE_COLLECTION_REGION}/${regionId}/${this.constant.FIREBASE_COLLECTION_ZONE}`).get()
    .pipe(
      map(zones => {
        //console.log(zones);
        return zones.docs.map(zn => {
          const id = zn.id;
            const data = zn.data();
            const objRegion:regionZone={
              id:id,
              ZoneName: data.ZoneName
            }
            //console.log(objRegion);
            return objRegion;
        })
      })
    )
  }
}
