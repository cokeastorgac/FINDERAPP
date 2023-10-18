import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);






     async takePicture () {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelPhoto: 'Elije una foto de tu Galeria',
      promptLabelPicture: 'Toma una foto'
    });
  
   
  };




  //LOADING

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //TOAST  
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //Enruta a cualquier pagina disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //Guarda un elemento
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //obtiene un elemento desde localStorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  //modal
  async presentModal(opts: ModalOptions){
    const modal = await this.modalCtrl.create(opts);
      await modal.present();

      const {data}= await modal.onWillDismiss();
      if(data) return data;
  }

  dissmissModal(data?: any){
    return this.modalCtrl.dismiss(data);
  }


}
