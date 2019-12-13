import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loaderInstance:any;
  constructor(private loader: LoadingController) { }

  async showLoader(){
    this.loaderInstance = await this.loader.create({
      message: 'loading..'
    });
    return await this.loaderInstance.present();
  }

  hideLoader(){
    setTimeout(() => {
      this.loaderInstance.dismiss();
    }, 100);
  }
}
