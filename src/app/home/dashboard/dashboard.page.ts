import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { dashboardItem } from 'src/app/Interfaces/dashboardItem';
import { ApartmentService } from 'src/app/services/apartment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  aparts: Observable<dashboardItem[]>
  regionId: string;
  zoneId: string;

  constructor(private route: ActivatedRoute, private router: Router, private apartmentService:ApartmentService) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let routeParams = this.router.getCurrentNavigation().extras.state;
        this.regionId = routeParams.regionId;
        this.zoneId = routeParams.zoneId;

        console.log("this.regionId: " + this.regionId);
        console.log("this.zoneId: " + this.zoneId);
        this.aparts = this.apartmentService.getApartmentsByRegionZoneId(this.regionId, this.zoneId)
        // .subscribe(res => {
        //   console.log(res);
        // })
        
      }
    });
  }

  ngOnInit() {
  }

}
