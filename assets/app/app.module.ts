import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing';
import { UserModule } from './user';

import { AppCmp } from './app.cmp';
import { TaskModule } from './task';
import { HomeCmp } from './home';
import {
  ErrorsParsingService,
  NotificationService
} from './services';

@NgModule({
  declarations: [
    AppCmp,
    HomeCmp,
    NotificationService
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    UserModule,
    TaskModule
  ],
  providers: [
    ErrorsParsingService,
    NotificationService
  ],
  bootstrap: [ AppCmp ]
})
export class AppModule {

}