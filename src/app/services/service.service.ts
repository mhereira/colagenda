import { AngularFireStorageModule } from 'angularfire2/storage';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()

export class serviceService {

	API_KEY = 'AIzaSyCjgDSWwtQstvHkCB-gytm1l_o7ByUJMyw';

	constructor(
		private angularFireDataBase: AngularFireDatabase,
		private angularFireStorage: AngularFireStorageModule,
		private db: AngularFirestore,
		private angularFireAuth: AngularFireAuth,
		private http: Http,
	) { }

	public isLogged() {
		return this.angularFireAuth.authState;
	}

	public getServicios(idServer) {
		if (idServer) {
			return firebase.firestore().collection('servicios').where('idServer', "==", idServer).get();
		}
	}

	public getServiciosById(idUsuario) {
		if (idUsuario) {
			return firebase.firestore().collection('servicios').where('userid', "==", idUsuario);
		}
	}

	public getServiciosUsuario(idUsuario) {
		if (idUsuario) {
			return firebase.firestore().collection('servicios').where('userid', "==", idUsuario).get();
		}
	}

	public getServiciosByUsuario(idUsuario) {
		if (idUsuario) {
			return firebase.firestore().collection('servicios').where('userid', "==", idUsuario);
		}
	}

	public getServicioDate(idServer, fecha) {
		if (idServer && fecha) {
			return firebase.firestore().collection('servicios')
				.where('idServer', "==", idServer).where('fecha', "==", fecha).get();
		}
	}

	public guardarservicio(servicio) {
		return firebase.firestore().doc('servicios/' + servicio.id).set(servicio);

	}

	public guardartransaccion(servicio) {
		return firebase.firestore().collection('transaccion').add(Object.assign({}, servicio)).then(ref => {
			firebase.firestore().doc('transaccion/' + ref.id).update({ id: ref.id });
		});
	}

	public upLoadPicture(pictures_name, image) {
		return firebase.storage().ref('pictures/' + pictures_name).putString(image, 'data_url');
	}

	public getService(idUsuario) {
		if (idUsuario)
			return firebase.firestore().collection('servicios').where('userid', '==', idUsuario).get();
	}

	public getServicioPorId(servicioId) {
		if (servicioId)
			return firebase.firestore().collection('servicios').where('id', "==", servicioId).get()
	}

	public registerServicio(servicio) {
		return firebase.firestore().doc('servicios/' + servicio.id).set(Object.assign({}, servicio));
	}

	public updateServicio(servicio: any) {
		console.log(servicio);
		return firebase.firestore().doc(`servicios/${servicio.id}`).update(servicio);
	}
}
