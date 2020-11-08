import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public title: string = 'SERV Premium';
	public user: any = {};
	constructor(
		private loginservice: AuthService
	) { }

	ngOnInit() {}
}
