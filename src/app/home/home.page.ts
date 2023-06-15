import { Component } from '@angular/core';
import { BleClient, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le';
import { AlertController } from '@ionic/angular';
const HEART_RATE_SERVICE = numberToUUID(0x180d);
@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {

	constructor(private alertController: AlertController) { }
	public async scan(): Promise<void> {
		console.log("[ INIT ] Escanenado BLE");
		try {
			await BleClient.initialize();
			await BleClient.requestLEScan({}, (result: ScanResult) => {
				console.log('[ RESPUESTA ] received new scan result', JSON.stringify(result));
			}
			);
			setTimeout(async () => {
				await BleClient.stopLEScan();
				console.log('[ SOTOP ] stopped scanning');
			}, 60000);
		} catch (error) {
			console.error("[ ERROR ] Error al escanear BLE", error);
		}
	}
	ngOnInit() { }

	async connectBluetooth(){
		// const device = await BleClient.requestDevice({
			
		// });
		await BleClient.disconnect('F9:36:41:41:36:4B');
		
		//  console.log(device);
		await BleClient.connect("F9:36:41:41:36:4B").then((data:any)=>{
			console.log(data);
		})
	}

	public async presentAlert() {
		const alert = await this.alertController.create({
			header: 'Alerta',
			message: 'Se va a usar el BLE.',
			buttons: [
				{
					text: 'Aceptar',
					handler: () => {
						// Código a ejecutar al aceptar la alerta
						this.scan();
					}
				},
				{
					text: 'Cancelar',
					role: 'cancel'
				}
			]
		});
		await alert.present();
	}

}
