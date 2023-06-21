import { Component } from '@angular/core';
import { BleClient, numbersToDataView, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le';
import { AlertController } from '@ionic/angular';
const HEART_RATE_SERVICE = numberToUUID(0x180d);

const BATTERY_SERVICE = '00001800-0000-1000-8000-00805f9b34fb';
const BATTERY_CHARACTERISTIC = '00002a00-0000-1000-8000-00805f9b34fb';
const POLAR_PMD_SERVICE = '00001800-0000-1000-8000-00805f9b34fb';
const POLAR_PMD_CONTROL_POINT = '00002a00-0000-1000-8000-00805f9b34fb';

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
			}, 10000);
		} catch (error) {
			console.error("[ ERROR ] Error al escanear BLE", error);
		}
	}
	ngOnInit() { }

	async connectBluetooth(){
		const device = await BleClient.requestDevice({
			// services: [HEART_RATE_SERVICE],
			// optionalServices: [BATTERY_SERVICE, POLAR_PMD_SERVICE],
		});
		 console.log(device);

		await BleClient.disconnect('F9:36:41:41:36:4B');
		
		await BleClient.connect("F9:36:41:41:36:4B").then((data:any)=>{
			console.log(data);
		});

		await BleClient.discoverServices(device.deviceId).then((data:any)=>{
			console.log("discoverServices()")
			console.log(data);
		});

		const battery = await BleClient.read(device.deviceId, POLAR_PMD_SERVICE, POLAR_PMD_CONTROL_POINT);
    	console.log('print', battery.getUint8(0),battery);

		await BleClient.write(device.deviceId, POLAR_PMD_SERVICE, POLAR_PMD_CONTROL_POINT, numbersToDataView([0x06, 0x07,0x08])).then((data:any)=>{
			console.log("write()")
			console.log(data);
		});;
		console.log('write done');

		const readd = await BleClient.read(device.deviceId, POLAR_PMD_SERVICE, POLAR_PMD_CONTROL_POINT);
    	console.log('print', readd.getUint8(0),readd.getUint8(1),readd.getUint8(2),readd);

		// const services= await BleClient.getServices(device.deviceId);
		// console.log('services');
		// console.log(services);

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
