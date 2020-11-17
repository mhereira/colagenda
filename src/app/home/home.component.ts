import { Component, OnInit } from '@angular/core';
import { firestore} from 'firebase';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public usuarioActivo: any = {};
  public ultimosServicios: any = [];
  public proximoServicio: any;
public selectedCity = "Bogotá" as string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {  this.usuarioActivo = this.authService.storeGetUserData('usuario');
  console.log({
    userActive: this.usuarioActivo
  });

  this.authService.getServiciosUsuario(this.usuarioActivo.id).then(value => {
    value.docs.forEach(doc => {
      let aux = doc.data();
      this.ultimosServicios.push(aux);
                    this.ultimosServicios = _.orderBy(this.ultimosServicios, ['fecha'], ['asc']);
                    this.proximoServicio = this.ultimosServicios[0];
      console.log(this.proximoServicio)
      
    
      
    })
    
  })
  }

  public irAgendadorEmpresas() {
    console.log("funcionando")
    this.seleccionarCiudad()
    localStorage.setItem("selectedService", "BusinessCleaning");
    this.router.navigate(['booking'], { state: { example: 'BusinessCleaning' } });
   

  }

  public irAgendadorHelper() {
    console.log("funcionando")
    this.seleccionarCiudad()
    localStorage.setItem("selectedService", "Helper");
    this.router.navigate(['booking'], { state: { example: 'Helper' } });
   

  }

  public seleccionarCiudad(){
    localStorage.setItem("selectedCity", this.selectedCity);
    console.log(this.selectedCity)
  }
 public salir(){
   this.authService.logout();
   this.router.navigate(['login']);
 }

  public irAgendadorLimpieza() {
    console.log("funcionando")
    this.seleccionarCiudad()
    localStorage.setItem("selectedService", "HomeCleaning");
    this.router.navigate(['booking'], { state: { example: 'HomeCleaning' } });
   

  }
  public irAgendadorDesinfeccion() {
    console.log("funcionando")
    this.seleccionarCiudad()
    localStorage.setItem("selectedService", "Disinfection");
    this.router.navigate(['booking'], { state: { example: 'Disinfection' } });
   

  }

}
