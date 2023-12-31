
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {


    form = new FormGroup({
      id: new FormControl(''),
      image: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required,Validators.minLength(4)]),
      descripcion: new FormControl('', [Validators.required,Validators.minLength(8)])
    })
  
    firebaseSvc = inject(FirebaseService);
    utilsSvc = inject(UtilsService);

    user = {} as User;
  
    ngOnInit() {

      this.user = this.utilsSvc.getFromLocalStorage('user');
    }
  
  
    //tomar o seleccionar foto
    async takeImage(){
      const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;
      this.form.controls.image.setValue(dataUrl);
    }

   async submit() {
      if (this.form.valid) {

        let path = `users/${this.user.uid}/products`
  
        const loading = await this.utilsSvc.loading();
        await loading.present();

        //subir foto y obtener la url
        let dataUrl = this.form.value.image;
        let imagePath = `${this.user.uid}/${Date.now()}`;  
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl);
        this.form.controls.image.setValue(imageUrl);

        delete this.form.value.id

        this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

          this.utilsSvc.dissmissModal({success: true });

          this.utilsSvc.presentToast({
            message:'formulario enviado existosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline'
          })
  

            
        }).catch(error => {
          console.log(error);
  
          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
  
        }).finally(() => {
          loading.dismiss();
        })
      }
    }

  }