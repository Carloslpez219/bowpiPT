import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController } from '@ionic/angular';
import { NewRecipePage } from '../new-recipe/new-recipe.page';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DetailPage } from '../detail/detail.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public alertButtons = ['OK'];
  datosUsuario: any;
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
  selectedItem: any = null; 
  @ViewChild('popover') popover;
  selectedFile!: File;
  myImage = null;

  async ngOnInit() {
    this.datosUsuario = await this.storage.get('datos');
  }

  constructor(private frstr: FirestoreService, private modalController: ModalController, private storage: Storage, private router: Router) {
    this.getItems();
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  getItems() {
    this.frstr.getItems().subscribe(items => {
      this.items = items;
      console.log(items);
    });
  }

  toggleDone(item: any) {
    const updatedDoneStatus = !item.done;
    this.setOpen(true);
    this.frstr.updateItemDone(item.id, updatedDoneStatus).then(() => {
      item.done = updatedDoneStatus;
      this.updateCalificacion(item);
    }).catch(error => {
      console.error("Error updating item: ", error);
    });
  }

  updateCalificacion(item: any) {
    if (!this.isAlertOpen) {
      this.setOpen(true);
    }
    console.log(item)
  }

  async newRecipe() {
    const modal = await this.modalController.create({
      component: NewRecipePage,
      backdropDismiss: false
    });
    await modal.present();      
  } 

  async details(item: any) {
    let recipe = item; 
    const modal = await this.modalController.create({
      component: DetailPage,
      backdropDismiss: false,
      componentProps: { recipe }
    });
    await modal.present();      
  } 

  async logOut(){
    this.router.navigateByUrl('/login');
    this.storage.remove('datos');
    this.storage.remove('ordenes');
    this.storage.clear();
  }

  async takeOrPickPicture(item: any){
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
  
      var imageUrl = image.dataUrl;
      this.frstr.updateItemImage(item.id, imageUrl);
      console.log(imageUrl);
    } catch (error) {
      console.error('Error taking or picking a picture:', error);
    }
  }

  deleteItem(item: any) {
    this.frstr.deleteItem(item.id).then(() => {
      this.items = this.items.filter(i => i.id !== item.id);
    }).catch(error => {
      console.error("Error deleting item: ", error);
    });
  }
}
