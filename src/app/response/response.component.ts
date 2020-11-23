import { Component, OnInit } from '@angular/core';
import { EpaycoService } from '../../app/services/epayco.service';
import { EpaycoTransaction } from '../../app/models/epayco.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { serviceService } from '../services/service.service';
import { database } from 'firebase';

@Component({
	selector: 'app-response',
	templateUrl: './response.component.html',
	styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
	refPayco: string = ''
	transactionResponse: any;
	public servicioAgendado: any = {};
	params: any;
	constructor(
		private epaycoService: EpaycoService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private ServicioService: serviceService

	) { this.servicioAgendado = JSON.parse(localStorage.getItem('servicioAgendado')); }

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(params => {
			this.refPayco = params.ref_payco;
			this.epaycoService.getTransactionResponse(this.refPayco).subscribe(data => {
				this.transactionResponse = data.data
				console.log(this.transactionResponse);
				//this.servicioAgendado = this.authService.storeGetUserData('servicioAgendado');
				// añadimos las propiedades del checkout y mandamos el servicio a la base de datos como orden de servicio
				this.servicioAgendado.referenciaPago = Number(this.transactionResponse.x_id_invoice)
				this.servicioAgendado.referenciaEpaycoPago = Number(this.transactionResponse.x_ref_payco)
				this.servicioAgendado.estadoPago = String(this.transactionResponse.x_transaction_state)
				this.servicioAgendado.fechaPago = String(this.transactionResponse.x_transaction_date)
				console.log(this.servicioAgendado)
				this.guardarServicio(this.servicioAgendado);
				console.log("servicio subido a firebase")
			});
		});
	}

	public guardarServicio(servicio) {
		if (servicio.userid != '' && servicio.horasDeServicio != '' && servicio.fecha != '' && servicio.hora != '' && servicio.direccion != '') {
			this.ServicioService.updateServicio(servicio).then(res => {
				console.log(res);
				console.log("servicio subido a firebase")
			})
		} else {
			alert('Error, debe volver a agendar su servicio o comunicarse');
		}
	}
}
