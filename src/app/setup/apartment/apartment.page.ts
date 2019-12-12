import { Component, OnInit } from '@angular/core';
import { ApartmentService } from 'src/app/services/apartment.service';
import { apartment } from 'src/app/Interfaces/apartment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.page.html',
  styleUrls: ['./apartment.page.scss'],
})
export class ApartmentPage implements OnInit {
  loadedApartments: Observable<apartment[]>;

  constructor(private apartmentService: ApartmentService) { }

  ngOnInit() {
    this.loadedApartments = this.apartmentService.getApartments();
  }

  filterApartments(evt) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }
 
    return this.loadedApartments
    .pipe(
      map(apts => {
        apts.filter(item => {
            if (item && searchTerm) {
              if (item.ApartmentName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                return true;
              }
              return false;
            }
          })
      })
    )
    
  }
}
