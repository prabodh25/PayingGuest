import { Component, OnInit } from '@angular/core';
import { roomType } from 'src/app/Interfaces/roomType';
import { RoomtypeService } from 'src/app/services/roomtype.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.page.html',
  styleUrls: ['./roomtype.page.scss'],
})
export class RoomtypePage implements OnInit {
  roomtypes: Observable<roomType[]>;

  constructor(private roomtypeService: RoomtypeService) { }

  ngOnInit() {
    this.roomtypes=this.roomtypeService.getRoomTypes();
    // const room: roomType={
    //   id:'',
    //   RoomName: 'Master Bedroom',
    //   IsDeleted:false,
    //   ModifiedDate: new Date()
    // }

    // this.roomtypeService.createRoomType(room)
    // .then(res => {
    //   console.log("room created");
    // })
  }

  

}
