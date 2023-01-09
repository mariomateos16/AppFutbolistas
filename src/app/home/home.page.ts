import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  futbolistaEditando: Tarea;
  arrayColeccionFutbolistas: any = [{
    id: "",
    data: {} as Tarea
  }];
  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacia al empezar
    this.futbolistaEditando = {} as Tarea;

    this.obtenerListaTareas();
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("tareas",this.futbolistaEditando)
    .then(()=>{
      console.log("Tarea creada correctamente");
      this.futbolistaEditando = {} as Tarea;
    },(error) =>{
      console.error(error)
    });
  }

  obtenerListaTareas(){
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaFutbolistas) => {
      this.arrayColeccionFutbolistas = [];
      resultadoConsultaFutbolistas.forEach((datosTareas: any) => {
        this.arrayColeccionFutbolistas.push({
          id: datosTareas.payload.doc.id,
          data: datosTareas.payload.doc.data()
        })
      })
    }
    )
  }
}