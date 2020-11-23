import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExampleDialogComponent } from '../example-dialog/example-dialog.component';

import { AuthService } from 'src/app/services/auth.service';
import { OpcionesService } from 'src/app/services/opciones.service';
import { serviceService } from '../services/service.service';
import { Router, ActivatedRoute } from "@angular/router";
import { GoogleServiceService } from '../services/google-service.service';

@Component({
	selector: 'app-booking',
	templateUrl: './booking.component.html',
	styleUrls: ['./booking.component.scss']
})

export class BookingComponent implements OnInit {

	//private declare ePayco: any;
	private window: any = window;
	private ePayco = this.window.ePayco.checkout.configure({
		key: '9ba686768c71a47df53e55acd1899430',
		test: true
	});




	public ciudadGoogle = "Bogotá D.C." as string;
	public direccion: any;
	public origin: any;
	public originDefault: any;
	public destination: any;
	public idLocation: string = '';
	public datosEdit: any;
	public usuarioActivo: any = {};
	public placePredictions: any[];
	public metodoPago = 'consignar';
	public descuento = 0;
	public servicioAgendado: any = {};
	public recargo = 0;
	public valorPorHora: number = 13500; //13500 COP por hora
	public user: any = {
		uid: '',
		locationAdress: '',
		city: localStorage.getItem("selectedCity"),
		adressComplements: '',
		country: 'Colombia',
		adressHints: '',
		name: '',
		lastName: '',
		email: '',
		contactPhone: '',
	};
	public idServer = ''

	public lat = 4.60971;
	public lng = -74.08175;
	public selectedService: string;
	public selectedCity: string;
	public imageService: any;
	public serviceStartTime;
	public serviceDate: string;
	public otro: string;

	public serviceHours: number = 0;
	public mostrarTotalHoras: any;
	public seleccionarTotalHoras: any;
	public mostrarTotalPrice: any;

	public homeService: any = {
		spaceAreaTime: 0,
		kitchenTime: 0,
		lavadoPlatosTime: 0,
		cocinarTime: 0,
		lavadoRopaTime: 0,
		planchadoTime: 0,
		bathroomsTime: 0,
		bedroomsTime: 0,

	};

	public bussinesService: any = {
		spaceAreaTime: 0,
		lavadoPlatosTime: 0,
		cocinarTime: 0,
		desks: 0,
		officeCleanUp: 0,
	};

	public disinfectionService: any = {
		spaceAreaTime: 0,
	};

	public helperService: any = {
		horasTotal: 0,
		adulto: false,
		menor: false,
		mascota: false,
		eventos: false,
		cooking: false,
		todero: false,
	};

	public servicios: any = [];
	public horaServicios: any = [];
	public areasGenerales: any = [];
	public tiempoCuartos: any = [];
	public tiempoCocinas: any = [];
	public tiempoBanos: any = [];
	public tiempoPlatos: any = [];
	public tiemposComida: any = [];
	public tiempoLavanderia: any = [];
	public tiempoPlanchado: any = [];
	public tiempoDesk: any = [];
	public SameServer = true;
	public city: string;
	public country: string;
	public department: string;
	public locationId: string;



	constructor(
		private authService: AuthService,
		private router: Router,
		private opcionesService: OpcionesService,
		public dialog: MatDialog,
		private ServicioService: serviceService,
		public activatedRoute: ActivatedRoute,
		public googleService: GoogleServiceService,
	) {
		this.selectedService = localStorage.getItem("selectedService");
		this.selectedCity = localStorage.getItem("selectedCity");
		if (this.selectedCity == "Medellín") { this.lng = -75.53611; this.lat = 6.29139 }
		if (this.selectedCity == "Bogotá") { this.city = "Bogotá D.C."; this.department = "Bogotá D.C."; this.country = "Colombia"; this.locationId = "4fZC8McSlOvpPfIZnG7w" }
		if (this.selectedCity == "Medellín") { this.city = "Medellin"; this.department = "Medellin"; this.country = "Colombia"; this.locationId = "bDS8BjlImklLBpSPctkh" }
		;

		console.log(this.selectedService)
		this.cargarSelects();
		// mantine el usuario de firebase loggeado
		let usuario = JSON.parse(localStorage.getItem('usuario'));
		this.user.email = usuario.email;
		this.user.uid = usuario.uid
	}

	ngOnInit() {
		this.usuarioActivo = this.authService.storeGetUserData('usuario');
		console.log({
			userActive: this.usuarioActivo

		});


	}

	openDialog() {
		const dialogRef = this.dialog.open(ExampleDialogComponent);

		dialogRef.afterClosed().subscribe(result => {
		});
		const dialogConfig = new MatDialogConfig();
		dialogConfig.position = {
			'top': '0',
			left: '0'
		};
	}
	public seleccionarServicio() {
		if (this.selectedService == 'HomeCleaning') {
			this.imageService = '/assets/imagenserviciolimpieza2.jpeg';
		} else if (this.selectedService == 'BusinessCleaning') {
			this.imageService = '/assets/imagenserviciolimpiezaempresas.jpeg';
		} else if (this.selectedService == 'Disinfection') {
			this.imageService = '/assets/imagenserviciodesinfeccion.jpeg';
		} else if (this.selectedService == 'Helper') {
			this.imageService = '/assets/imagenserviciohelper.jpeg';
		}
		this.mostrarTotalHoras = 0;
	}
	public volver() {
		this.router.navigate(['servicios']);


	}
	public actualizarFactura() {

		if (this.seleccionarTotalHoras == 2) { this.mostrarTotalPrice = 39900 }
		else if (this.seleccionarTotalHoras == 3) { this.mostrarTotalPrice = 49900 }
		else if (this.seleccionarTotalHoras == 4) { this.mostrarTotalPrice = 59900 }
		else if (this.seleccionarTotalHoras == 5) { this.mostrarTotalPrice = 64900 }
		else if (this.seleccionarTotalHoras == 6) { this.mostrarTotalPrice = 69900 }
		else if (this.seleccionarTotalHoras == 7) { this.mostrarTotalPrice = 74900 }
		else if (this.seleccionarTotalHoras == 8) { this.mostrarTotalPrice = 79900 }
	}

	public homeServiceFactura() {
		this.homeService.horasTotal = 0;

		//suma basica
		this.homeService.horasTotal = Number(this.homeService.spaceAreaTime) + Number((this.homeService.kitchenTime)) + Number(this.homeService.lavadoPlatosTime) + Number(this.homeService.cocinarTime) + Number(this.homeService.lavadoRopaTime) + Number(this.homeService.planchadoTime) + Number(this.homeService.bathroomsTime) + Number(this.homeService.bedroomsTime);
		//suma checkBoxes
		if (this.homeService.cleanInside == true) { this.homeService.horasTotal = this.homeService.horasTotal + 15; }
		if (this.homeService.cleanOven == true) { this.homeService.horasTotal = this.homeService.horasTotal + 15; }
		if (this.homeService.cleanFridge == true) { this.homeService.horasTotal = this.homeService.horasTotal + 45; }
		if (this.homeService.studio == true) { this.homeService.horasTotal = this.homeService.horasTotal + 20; }
		if (this.homeService.garage == true) { this.homeService.horasTotal = this.homeService.horasTotal + 60; }
		if (this.homeService.windowDeep == true) { this.homeService.horasTotal = this.homeService.horasTotal + 45; }
		if (this.homeService.cleanKitchen == true) { this.homeService.horasTotal = this.homeService.horasTotal + 20; }
		if (this.homeService.balcon == true) { this.homeService.horasTotal = this.homeService.horasTotal + 30; }
		if (this.homeService.jardin == true) { this.homeService.horasTotal = this.homeService.horasTotal + 60; }
		this.mostrarTotalHoras = this.minutesToString(this.homeService.horasTotal)

		return this.homeService.horasTotal
	}

	public bussinesServiceFactura() {
		this.bussinesService.horasTotal = 0;
		this.bussinesService.horasTotal = Number(this.bussinesService.spaceAreaTime) + Number(this.bussinesService.lavadoPlatosTime) + Number(this.bussinesService.cocinarTime) + Number(this.bussinesService.desks) + Number(this.bussinesService.officeCleanUp) + Number(this.bussinesService.bathroomsTime);
		if (this.bussinesService.cleanInside == true) { this.bussinesService.horasTotal = this.bussinesService.horasTotal + 15; }
		if (this.bussinesService.shopWindow == true) { this.bussinesService.horasTotal = this.bussinesService.horasTotal + 20; }
		if (this.bussinesService.meetingRoom == true) { this.bussinesService.horasTotal = this.bussinesService.horasTotal + 20; }

		this.mostrarTotalHoras = this.minutesToString(this.bussinesService.horasTotal);
		return this.bussinesService.horasTotal
	}

	public disinfectionServiceFactura() {
		this.disinfectionService.horasTotal = 0;
		this.disinfectionService.horasTotal = Number(this.disinfectionService.spaceAreaTime);
		this.mostrarTotalHoras = (this.disinfectionService.horasTotal / 60);
		if (this.disinfectionService.horasTotal == 10) { this.mostrarTotalPrice = 35000 }
		else if (this.disinfectionService.horasTotal == 20) { this.mostrarTotalPrice = 35000 }
		else if (this.disinfectionService.horasTotal == 30) { this.mostrarTotalPrice = 35000 }
		else if (this.disinfectionService.horasTotal == 40) { this.mostrarTotalPrice = 39900 }
		else if (this.disinfectionService.horasTotal == 50) { this.mostrarTotalPrice = 44900 }
		else if (this.disinfectionService.horasTotal == 60) { this.mostrarTotalPrice = 49900 }
		else if (this.disinfectionService.horasTotal == 70) { this.mostrarTotalPrice = 54900 }
		else if (this.disinfectionService.horasTotal == 80) { this.mostrarTotalPrice = 59900 }
		else if (this.disinfectionService.horasTotal == 90) { this.mostrarTotalPrice = 64900 }
		else if (this.disinfectionService.horasTotal == 100) { this.mostrarTotalPrice = 69900 }
		else if (this.disinfectionService.horasTotal == 110) { this.mostrarTotalPrice = 74900 }
		else if (this.disinfectionService.horasTotal == 120) { this.mostrarTotalPrice = 79900 }
		else if (this.disinfectionService.horasTotal == 140) { this.mostrarTotalPrice = 84900 }
		else if (this.disinfectionService.horasTotal == 160) { this.mostrarTotalPrice = 89900 }
		else if (this.disinfectionService.horasTotal == 180) { this.mostrarTotalPrice = 94500 }
		else if (this.disinfectionService.horasTotal == 200) { this.mostrarTotalPrice = 99900 }
		else if (this.disinfectionService.horasTotal == 220) { this.mostrarTotalPrice = 125000 }
		else if (this.disinfectionService.horasTotal == 240) { this.mostrarTotalPrice = 150000 }
		else if (this.disinfectionService.horasTotal == 260) { this.mostrarTotalPrice = 175000 }
		else if (this.disinfectionService.horasTotal == 280) { this.mostrarTotalPrice = 200000 }
		else { this.mostrarTotalPrice = 250000 }
		return this.disinfectionService.horasTotal
	}

	public helperServiceFactura() {
		this.helperService.horasTotal = 0;
		this.mostrarTotalHoras = this.minutesToString(this.helperService.horasTotal);
		return this.helperService.horasTotal
	}

	public minutesToString(minutes) {
		let hour;
		let minute;
		hour = Math.floor(minutes / 60);
		hour = (hour < 10) ? '0' + hour : hour;
		minute = Math.floor((minutes) % 60);
		minute = (minute < 10) ? '0' + minute : minute;
		return hour + ':' + minute;
	}

	public cargarSelects() {
		this.servicios = this.opcionesService.tipoServicio();
		this.horaServicios = this.opcionesService.horaServicio();
		this.areasGenerales = this.opcionesService.tiempoGenerales();
		this.tiempoCocinas = this.opcionesService.cocina();
		this.tiempoCuartos = this.opcionesService.cuartos();
		this.tiempoBanos = this.opcionesService.banos();
		this.tiempoPlatos = this.opcionesService.platos();
		this.tiemposComida = this.opcionesService.comida();
		this.tiempoLavanderia = this.opcionesService.lavanderia();
		this.tiempoPlanchado = this.opcionesService.planchado();
		this.tiempoDesk = this.opcionesService.desk();
	}

	public valorServicio(minutos) {
		let horas = (minutos / 60);

		let precio = horas * this.valorPorHora;
		console.log(precio)
		let precioFinal = Math.round(precio * 100) / 100;

		return precioFinal
	}

	public agendar() {
		if (this.selectedService == 'HomeCleaning') {
			this.agendarHomeCleaning();
		} else if (this.selectedService == 'BusinessCleaning') {
			this.agendarBusinessCleaning()
		} else if (this.selectedService == 'Disinfection') {
			this.agendarDisinfection();
		} else if (this.selectedService == 'Helper') {
			this.agendarHelper();
		}
		this.openCheckout()
	}

	public agendarHelper() {
		let x = Number(this.seleccionarTotalHoras)
		this.helperService.horas = Math.round(x * 100) / 100;
		this.servicioAgendado = {};
		this.servicioAgendado = {
			servicio: this.selectedService,
			adulto: this.helperService.adulto,
			reunion: this.helperService.eventos,
			niños: this.helperService.menor,
			alimentos: this.helperService.cooking,
			mascota: this.helperService.mascota,
			todero: this.helperService.todero,
			direccion: this.user.locationAdress,
			direccionComplementos: this.user.adressComplements,
			direccionIndicaciones: this.user.adressHints,
			observaciones: this.user.adressHints,
			cities: this.city,
			client: this.usuarioActivo,
			country: this.country,
			creado: "web",
			department: this.department,
			descuento: this.descuento,
			destination: { lat: this.lat, lng: this.lng },
			enviarCorreo: false,
			estado: "Orden de servicio",
			fecha: this.serviceDate,
			fechaCreacion: Date.now(),
			formaDePago: this.metodoPago,
			hora: this.serviceStartTime,
			horasDeServicio: this.helperService.horas,
			id: Date.now(),
			idServer: "",
			otro: this.otro,
			precio: this.mostrarTotalPrice,
			recargo: this.recargo,
			tipoServicio: "Plan Individual",
			total: this.mostrarTotalPrice,
			userid: this.usuarioActivo.id
		}
		console.log(this.servicioAgendado);
		localStorage.setItem('servicioAgendado', JSON.stringify(this.servicioAgendado));
		this.guardarServicio(this.servicioAgendado)
	}

	public agendarBusinessCleaning() {
		let x = (this.bussinesService.horasTotal / 60)
		this.bussinesService.horas = Math.round(x * 100) / 100;
		this.servicioAgendado = {};
		this.servicioAgendado = {
			servicio: this.selectedService,
			limpieza: true,
			adulto: this.helperService.adulto,
			reunion: this.helperService.eventos,
			niños: this.helperService.menor,
			alimentos: this.helperService.cooking,
			mascota: this.helperService.mascota,
			todero: this.helperService.todero,
			direccion: this.user.locationAdress,
			direccionComplementos: this.user.adressComplements,
			direccionIndicaciones: this.user.adressHints,
			observaciones: this.user.adressHints,
			cities: this.city,
			client: this.usuarioActivo,
			country: this.country,
			creado: "web",
			department: this.department,
			descuento: this.descuento,
			destination: { lat: this.lat, lng: this.lng },
			enviarCorreo: false,
			estado: "Orden de servicio",
			fecha: this.serviceDate,
			fechaCreacion: Date.now(),
			formaDePago: this.metodoPago,
			hora: this.serviceStartTime,
			horasDeServicio: this.bussinesService.horas,
			id: Date.now(),
			idServer: "",
			otro: this.otro,
			precio: this.mostrarTotalPrice,
			recargo: this.recargo,
			tipoServicio: "Plan Individual",
			total: this.mostrarTotalPrice,
			userid: this.usuarioActivo.id
		}
		this.servicioAgendado.limpieza = true;
		if (this.bussinesService.cocinarTime > 0) { this.servicioAgendado.cafeteria = true }
		if (this.bussinesService.meetingRoom == true) { this.servicioAgendado.reunion = true }
		if (this.bussinesService.shopWindow == true) { this.servicioAgendado.limpiezaEstanteria = true }
		console.log(this.servicioAgendado);
		localStorage.setItem('servicioAgendado', JSON.stringify(this.servicioAgendado));
		this.guardarServicio(this.servicioAgendado)
	}

	public agendarHomeCleaning() {
		let x = (this.homeService.horasTotal / 60)
		this.homeService.horas = Math.round(x * 100) / 100;
		this.servicioAgendado = {};
		this.servicioAgendado = {
			servicio: this.selectedService,
			limpieza: true,
			adulto: this.helperService.adulto,
			reunion: this.helperService.eventos,
			niños: this.helperService.menor,
			alimentos: this.helperService.cooking,
			mascota: this.helperService.mascota,
			todero: this.helperService.todero,
			direccion: this.user.locationAdress,
			direccionComplementos: this.user.adressComplements,
			direccionIndicaciones: this.user.adressHints,
			observaciones: this.user.adressHints,
			cities: this.city,
			client: this.usuarioActivo,
			country: this.country,
			creado: "web",
			department: this.department,
			descuento: this.descuento,
			destination: { lat: this.lat, lng: this.lng },
			enviarCorreo: false,
			estado: "Orden de servicio",
			fecha: this.serviceDate,
			fechaCreacion: Date.now(),
			formaDePago: this.metodoPago,
			hora: this.serviceStartTime,
			horasDeServicio: this.homeService.horas,
			id: Date.now(),
			idServer: "",
			otro: this.otro,
			precio: this.mostrarTotalPrice,
			recargo: this.recargo,
			tipoServicio: "Plan Individual",
			total: this.mostrarTotalPrice,
			userid: this.usuarioActivo.id
		}
		if (this.homeService.cocinarTime > 0) {
			this.servicioAgendado.alimentos = true
			this.servicioAgendado.cafeteria = true
		}
		if (this.homeService.lavadoRopaTime > 0) { this.servicioAgendado.lavado = true }
		if (this.homeService.planchadoTime > 0) { this.servicioAgendado.planchado = true }
		console.log(this.servicioAgendado);
		localStorage.setItem('servicioAgendado', JSON.stringify(this.servicioAgendado));

		this.guardarServicio(this.servicioAgendado)
	}

	public agendarDisinfection() {
		let x = (this.disinfectionService.horasTotal / 60)
		this.disinfectionService.horas = Math.round(x * 100) / 100;
		this.servicioAgendado = {};
		this.servicioAgendado = {
			servicio: this.selectedService,
			adulto: this.helperService.adulto,
			reunion: this.helperService.eventos,
			niños: this.helperService.menor,
			alimentos: this.helperService.cooking,
			mascota: this.helperService.mascota,
			todero: this.helperService.todero,
			direccion: this.user.locationAdress,
			direccionComplementos: this.user.adressComplements,
			direccionIndicaciones: this.user.adressHints,
			observaciones: this.user.adressHints,
			cities: this.city,
			client: this.usuarioActivo,
			country: this.country,
			creado: "web",
			department: this.department,
			descuento: this.descuento,
			destination: { lat: this.lat, lng: this.lng },
			enviarCorreo: false,
			estado: "Orden de servicio",
			fecha: this.serviceDate,
			fechaCreacion: Date.now(),
			formaDePago: this.metodoPago,
			hora: this.serviceStartTime,
			horasDeServicio: this.mostrarTotalHoras,
			id: Date.now(),
			idServer: "",
			otro: this.otro,
			precio: this.mostrarTotalPrice,
			recargo: this.recargo,
			tipoServicio: "Plan Individual",
			total: this.mostrarTotalPrice,
			userid: this.usuarioActivo.id
		}
		console.log(this.servicioAgendado)
		localStorage.setItem("servicioAgendado", JSON.stringify(this.servicioAgendado));
		this.guardarServicio(this.servicioAgendado)
	}

	public guardarServicio(servicio) {
		if (servicio.userid != '' && servicio.horasDeServicio != '' && servicio.fecha != '' && servicio.hora != '' && servicio.direccion != '') {
			this.ServicioService.registerServicio(servicio);
		} else {
			alert('Por favor Llenar todos los campos');
		}
	}

	public openCheckout() {
		var data = {
			//Parametros compra (obligatorio)
			invoice: Date.now(),
			currency: "cop",
			name: this.selectedService,
			description: this.selectedService,
			tax_base: '0',
			tax: '0',
			amount: this.servicioAgendado.precio,
			country: "co",
			lang: "es",
			external: "false",
			//Onpage="false" - Standard="true"
			//Atributos opcionales
			method: 'GET',
			extra1: '',
			extra2: 'ePayco',
			extra3: '',

			//Atributos cliente
			name_billing: this.usuarioActivo.name,
			address_billing: this.servicioAgendado.direccion,
			type_doc_billing: "cc",
			mobilephone_billing: this.usuarioActivo.telefono,
			number_doc_billing: this.usuarioActivo.documento,

			//atributo deshabilitación metodo de pago
			//methodsDisable: ["TDC", "PSE","SP","CASH","DP"],

			response: "http://localhost:4200/response",
			confirmation: "http://localhost:4200/gracias",
		}
		/*
	  var data={
		  //Parametros compra (obligatorio)
		  name: "Vestido Mujer Primavera",
		  description: "Vestido Mujer Primavera",
		  invoice: "1234",
		  currency: "cop",
		  amount: "12000",
		  tax_base: "0",
		  tax: "0",
		  country: "co",
		  lang: "en",

		  //Onpage="false" - Standard="true"
		  external: "false",


		  //Atributos opcionales
		  extra1: "extra1",
		  extra2: "extra2",
		  extra3: "extra3",
		  response: "http://localhost:4200/response",
		  confirmation: "http://localhost:4200/confirmation",



		  }*/
		this.ePayco.onCloseModal = this.onCloseEpaycoModal
		this.ePayco.open(data);
	}

	onCloseEpaycoModal() {
		alert('Close ePayco Modal!!!!!!!')
	}
}
