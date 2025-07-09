import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [],
  imports: [
    ButtonModule,
    CardModule,
    PasswordModule,
    InputTextModule
  ],
  exports: [
    ButtonModule,
    CardModule,
    PasswordModule,
    InputTextModule
  ]
})
export class PrimeNgModule { }
