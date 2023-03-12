import { Component } from '@angular/core';
import { Futbol } from '../futbol';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  futbolistaEditando: Futbol;

  arrayColeccionFutbolistas: any = [{
    id: "",
    data: {} as Futbol
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una tarea vacia al empezar
    this.futbolistaEditando = {} as Futbol;

    this.obtenerListaFutbolistas();
  }



  obtenerListaFutbolistas(){
    this.firestoreService.consultar("futbolistas").subscribe((resultadoConsultaFutbolistas) => {
      this.arrayColeccionFutbolistas = [];
      resultadoConsultaFutbolistas.forEach((datosFutbolistas: any) => {
        this.arrayColeccionFutbolistas.push({
          id: datosFutbolistas.payload.doc.id,
          data: datosFutbolistas.payload.doc.data()
        })
      })
    }
    )
  }

  segPantalla() {
    this.router.navigate(['/detalle/nuevo']);
  }

  idFutboSelec: string;

  selecFutbo(FutboSelec) {
    console.log("Futbolista seleccionado: ");
    console.log(FutboSelec);
    this.idFutboSelec = FutboSelec.id;
    this.futbolistaEditando.nombre = FutboSelec.data.nombre;
    this.futbolistaEditando.apellido = FutboSelec.data.apellido;
    this.futbolistaEditando.equipo = FutboSelec.data.equipo;
    this.futbolistaEditando.nacionalidad = FutboSelec.data.nacionalidad;
    this.futbolistaEditando.edad = FutboSelec.data.edad;
    this.futbolistaEditando.goles = FutboSelec.data.goles;
    this.futbolistaEditando.asistencias = FutboSelec.data.asistencias;
    this.futbolistaEditando.posicion = FutboSelec.data.posicion;

    this.router.navigate(['/detalle', this.idFutboSelec]);
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("futbolistas",this.futbolistaEditando)
    .then(()=>{
      console.log("Futbolista creado correctamente");
      this.futbolistaEditando = {} as Futbol;
    },(error) =>{
      console.error(error)
    });
  }

  clickBotonBorrar() {
    this.firestoreService.borrar("futbolistas", this.idFutboSelec).then(() => {
      console.log("Entrando");
      // Actualizar la lista completa
      this.obtenerListaFutbolistas();
      // Limpiar datos de pantalla
      this.futbolistaEditando = {} as Futbol;
    })
  }

}