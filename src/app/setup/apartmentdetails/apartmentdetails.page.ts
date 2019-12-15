import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apartment } from 'src/app/Interfaces/apartment';
import { ApartmentService } from 'src/app/services/apartment.service';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { apartmentType } from 'src/app/Interfaces/apartmentType';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-apartmentdetails',
  templateUrl: './apartmentdetails.page.html',
  styleUrls: ['./apartmentdetails.page.scss'],
})
export class ApartmentdetailsPage implements OnInit {
  public apartmentForm: FormGroup;
  apartTypes: apartmentType[] = [];
  aptId: string = '';
  addId: string = '';
  phoneId: string = '';
  detailSubscription: Subscription;
  apartmentTypesSubsription: Subscription;

  constructor(private route: ActivatedRoute, private apartmentService: ApartmentService,
    private formBuilder: FormBuilder, private loader: LoaderService, private alert: AlertController,
    private loc: Location) {
    //console.log('constructor');
    this.apartTypes.push({
      id: '',
      TypeName: '',
      IsDeleted: false,
      ModifiedDate: new Date()
    })
    console.log(this.apartTypes);
    this.apartmentForm = formBuilder.group({
      apartmentName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      apartmentType: new FormControl(this.apartTypes[0], Validators.compose([
        Validators.required
      ])),
      address1: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address2: new FormControl(''),
      address3: new FormControl(''),
      state: new FormControl('', Validators.compose([
        Validators.required
      ])),
      city: new FormControl('', Validators.compose([
        Validators.required
      ])),
      pin: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phone1: new FormControl(''),
      phone2: new FormControl('')
    });

  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter');

  }

  ionViewDidEnter() {
    //console.log('ionViewDidEnter');
    // console.log(this.apartTypes);
    this.loader.showLoader();

    this.apartmentTypesSubsription = this.apartmentService.getApartmentTypes().subscribe(types => {
      // console.log('Inside subscription');
      // console.log(types);
      this.apartTypes = types;
      this.getDetails();

    },
      err => {
        console.log(err);
        this.loader.hideLoader();
      });

  }

  ionViewWillLeave() {
    //console.log('ionViewWillLeave');
    if (this.detailSubscription)
      this.detailSubscription.unsubscribe();
    if (this.apartmentTypesSubsription)
      this.apartmentTypesSubsription.unsubscribe();
    //this.apartTypes.length = 0;
  }

  getDetails() {
    this.aptId = this.route.snapshot.paramMap.get("id");
    //console.log("id: " + aptId);
    //console.log("getDetails: " + this.aptId);
    if (this.aptId == "new") {
      this.apartmentForm.setValue({
        apartmentName: '',
        apartmentType: this.apartTypes[0],
        address1: '',
        address2: '',
        address3: '',
        state: '',
        city: '',
        pin: '',
        phone1: '',
        phone2: ''
      })
      this.loader.hideLoader();
    }
    else {
      this.detailSubscription = this.apartmentService.getApartmentById(this.aptId).subscribe(res => {
        //console.log(res);
        let data = res;
        this.addId = data.address.id;
        this.phoneId = data.phone.id

        this.apartmentForm.setValue({
          apartmentName: data.apartment.ApartmentName,
          apartmentType: this.apartTypes.find(res => res.id == data.apartmenttype.id),
          address1: data.address.Line1,
          address2: data.address.Line2,
          address3: data.address.Line3,
          state: data.address.State,
          city: data.address.City,
          pin: data.address.PIN,
          phone1: data.phone.Phone1,
          phone2: data.phone.Phone2
        })
        this.loader.hideLoader();
      });
    }
  }

  ngOnInit() {


  }

  onSaveClick() {
    this.loader.showLoader();
    this.apartmentService.createApartment(this.aptId, this.addId, this.phoneId, this.apartmentForm.value)
      .then(res => {
        this.loader.hideLoader();
        this.presentAlert('Facility created successfully');
        //console.log('success');
      })
      .catch(err => {
        this.loader.hideLoader();
        console.log(err);
      })

  }

  showAlert() {
    this.presentAlert("test");
  }

  async presentAlert(msg: string) {
    this.loc.back();
  }

}
