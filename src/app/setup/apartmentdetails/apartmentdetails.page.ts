import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apartment } from 'src/app/Interfaces/apartment';
import { ApartmentService } from 'src/app/services/apartment.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apartmentdetails',
  templateUrl: './apartmentdetails.page.html',
  styleUrls: ['./apartmentdetails.page.scss'],
})
export class ApartmentdetailsPage implements OnInit {

  apt: apartment;
  constructor(private route: ActivatedRoute, private apartmentService: ApartmentService) { }

  ngOnInit() {
    let aptId = this.route.snapshot.paramMap.get("id");
    console.log("id: " + aptId);
    if (aptId == "new") {
      this.apt=this.apartmentService.getNewApartment();
    }
    else {
      this.apartmentService.getApartmentById(aptId).subscribe(res => {
        this.apt = res;
      });
    }
    
  }

}
