import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  pattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private navCtrl: NavController, public loadingController: LoadingController, private alertService: AlertService,  private storage: Storage, private router: Router, private frstr: FirestoreService) {
                this.loginForm = this.createFormGroup();
              }


  ngOnInit() {
  }
               

  createFormGroup() {
    return new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  get nombre() { return this.loginForm.get('nombre'); }
  get password() { return this.loginForm.get('password'); }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  async onLogin() {
    
  }

  async login() {
    this.presentLoading();
    try {
      const response = await this.frstr.login(this.loginForm.value.nombre, this.loginForm.value.password);
      if (response.success) {
        await this.loadingController.dismiss();
        this.navCtrl.navigateRoot('/');
      } else {
        await this.loadingController.dismiss();
        const message = 'Usuario y/o Contraseña son incorrectos';
        this.alertService.presentToast(message, 'danger', 3000);
      }
    } catch (error) {
      await this.loadingController.dismiss();
      const message = 'Login error, intente de nuevo mas tarde.';
        this.alertService.presentToast(message, 'dark', 3000);
    }
  }
}

