import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  @Input() recipe;

  constructor(private modalCtrl: ModalController, private frstr: FirestoreService) { }

  ngOnInit() {
    console.log(this.recipe)
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  toggleDone() {
    const updatedDoneStatus = !this.recipe.done;
    this.frstr.updateItemDone(this.recipe.id, updatedDoneStatus).then(() => {
      this.recipe.done = updatedDoneStatus;
    }).catch(error => {
      console.error("Error updating item: ", error);
    });
  }

}
