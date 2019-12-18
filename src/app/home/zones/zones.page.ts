import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { regionZone } from 'src/app/Interfaces/zone';
import { Observable } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.page.html',
  styleUrls: ['./zones.page.scss'],
})
export class ZonesPage implements OnInit {
  zones:Observable<regionZone[]>;
regionId:string;
  constructor(private common: CommonService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.regionId = this.route.snapshot.paramMap.get("id");
    this.zones = this.common.getZonesByRegionId(this.regionId);
    //console.log(this.zones);
  }

  openDashboard(zoneId:string){
    let extras: NavigationExtras = {
      state:{
        regionId: this.regionId,
        zoneId: zoneId
      }
    }

    this.router.navigate(['tabs/home/dashboard'],extras)
  }

}
