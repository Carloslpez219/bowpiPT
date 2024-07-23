import { Component, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController } from '@ionic/angular';
import { NewRecipePage } from '../new-recipe/new-recipe.page';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public alertButtons = ['OK'];
  public alertInputs = [
    {
      label: '1',
      type: 'radio',
      value: '1',
    },
    {
      label: '2',
      type: 'radio',
      value: '2',
    },
    {
      label: '3',
      type: 'radio',
      value: '3',
    },
  ];

  items;
  isAlertOpen = false;
  @ViewChild('popover') popover;

  constructor(private frstr: FirestoreService, private modalController: ModalController, private storage: Storage) {
    this.getItems();
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  getItems() {
    this.frstr.getItems().subscribe(items => {
      this.items = items;
      console.log(items)
    });
  }

  toggleDone(item: any) {
    const updatedDoneStatus = !item.done;
    this.setOpen(true);
    this.frstr.updateItemDone(item.id, updatedDoneStatus).then(() => {
      item.done = updatedDoneStatus;
    }).catch(error => {
      console.error("Error updating item: ", error);
    });
  }

  updateCalificacion(item: any, newCalificacion: string) {
    this.frstr.updateItemCalificacion(item.id, newCalificacion).then(() => {
      item.calificacion = newCalificacion;
    }).catch(error => {
      console.error("Error updating item: ", error);
    });
  }

  //agregar receta

  async newRecipe() {
    const modal = await this.modalController.create({
      component: NewRecipePage,
      backdropDismiss: false
    });
    await modal.present();      
  } 

  async logOut(){
    this.storage.remove('datos');
    this.storage.remove('ordenes');
    this.storage.clear();
  }

}
