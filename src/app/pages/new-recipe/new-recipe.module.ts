import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewRecipePageRoutingModule } from './new-recipe-routing.module';

import { NewRecipePage } from './new-recipe.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewRecipePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewRecipePage]
})
export class NewRecipePageModule {}
