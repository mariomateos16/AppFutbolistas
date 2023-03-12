import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Futbol } from '../futbol';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular'; 
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  isNew: boolean;

  handlerMessage = '';
  roleMessage = '';

  futbolistaEditando: Futbol;
  id: string =""

  document: any = {
    id: "",
    data: {} as Futbol
  };

  constructor(private activatedRoute: ActivatedRoute, 
              private firestoreService: FirestoreService, 
              private router: Router, 
              private alertController: AlertController,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private socialSharing: SocialSharing,
              private imagePicker: ImagePicker) { 
    this.futbolistaEditando = {} as Futbol;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    if (this.id === 'nuevo') {
      this.isNew = true;
    } else {
      this.isNew = false;
    }


    this.firestoreService.consultarPorId("futbolistas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.nombre);
        console.log(this.document.data.apellido);
        console.log(this.document.data.equipo);
        console.log(this.document.data.nacionalidad);
        console.log(this.document.data.posicion);
        console.log(this.document.data.edad);
        console.log(this.document.data.goles);
        console.log(this.document.data.asistencias);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Futbol;
      } 
    });
  }
  
  async clickBotonBorrar() {
    const alert = await this.alertController.create({
      header: '¿Desea borrar futbolista?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.firestoreService.borrar("futbolistas", this.id).then(() => {
            })
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }

  clickBotonModificar() {
    if (this.id == "nuevo") {
    this.firestoreService.insertar("futbolistas", this.document.data).then(() => {
    })
  } else {
    this.firestoreService.actualizar("futbolistas", this.id, this.document.data).then(() => {
    })
  }
}
  
  clickVolver() {
  this.router.navigate(['/home']);
  }

  async uploadImagePicker() {

    const loading = await this.loadingController.create({
      message: 'Espere...'
    });

    const toast = await this.toastController.create({
      message: 'La imágen fue actualizada con éxito',
      duration: 3000
    });

    this.imagePicker.hasReadPermission().then (
      (result) => {
        if(result == false) {
          this.imagePicker.requestReadPermission();
        }
        else {
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then (
            (results) => {
              let nombreCarpeta = "imagenes";
              for (var i = 0; i < results.length; i++) {
                loading.present();
                let nombreImagen = `${new Date().getTime()}`;
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        console.log("downloadURL: " + downloadURL);
                        this.document.data.imagen = downloadURL;
                        toast.present();
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'La imágen fue borrada con éxito',
      duration: 3000
  });
  this.firestoreService.deleteFileFromURL(fileURL)
    .then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    });
  }

   compartir() {
      
    this.socialSharing.share()
    
  } 

}
