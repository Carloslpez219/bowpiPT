import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.page.html',
  styleUrls: ['./new-recipe.page.scss'],
})
export class NewRecipePage implements OnInit {

  constructor(private modalCtrl: ModalController,  private frstr: FirestoreService, private alerService: AlertService) { }

  newForm!: FormGroup;

  ngOnInit() {
    this.newForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (this.newForm.valid) {
      this.addNewRecipe();
    }
  }

  get titulo() { return this.newForm.get('titulo'); }
  get descripcion() { return this.newForm.get('descripcion'); }

  addNewRecipe() {
    this.frstr.addRecipe(this.newForm.value.titulo, this.newForm.value.descripcion).then(() => {
      this.alerService.presentToast('Receta anadida con exito.', 'success', 3000);
      this.modalCtrl.dismiss();
    }).catch(error => {
      this.alerService.presentToast(error, 'danger', 3000);
    });
  }
}
