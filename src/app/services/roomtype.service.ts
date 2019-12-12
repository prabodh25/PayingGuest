import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { roomType } from '../Interfaces/roomType';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Promise } from 'q';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeService {
  private room: Observable<roomType[]>;
  private roomCollection: AngularFirestoreCollection<roomType>;

  constructor(private afs: AngularFirestore) {
    try {
      this.roomCollection = afs.collection<roomType>('RoomType');
      this.room = this.roomCollection.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as roomType;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }));
    } catch (error) {
      console.log(error);
    }
  }

  getRoomTypes() {
    return this.room;
  }

  getRoomTypeById(aptId: string) {
    return this.afs.collection('Apartment').doc<roomType>(aptId).valueChanges();
  }

  createRoomType(objRoom: roomType) {
    const roomId = this.afs.createId();
    console.log("Room ID: " + roomId);
    delete objRoom.id;
    objRoom.IsDeleted = false;
    objRoom.ModifiedDate = new Date();
    return this.afs.doc(`RoomType/${roomId}`).set(objRoom);

  }
}
