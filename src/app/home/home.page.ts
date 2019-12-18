import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { region } from '../Interfaces/region';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  regions:Observable<region[]>;
  constructor(private common: CommonService) { }

  ngOnInit() {
    this.regions = this.common.getRegions();
  }

}
