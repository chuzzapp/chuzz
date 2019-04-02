import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetailsPageForm } from './item-details-form';

import { FormLayout1Module } from '../../components/forms/layout-1/form-layout-1.module';


@NgModule({
  declarations: [
    ItemDetailsPageForm,
  ],
  imports: [
    IonicPageModule.forChild(  ItemDetailsPageForm),
    FormLayout1Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ItemDetailsPageFormeModule {}
