import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenubarModule } from 'primeng/menubar';

const PRIMENG_MODULES = [
  ButtonModule,
  CardModule,
  PasswordModule,
  InputTextModule,
  ToastModule,
  ConfirmDialogModule,
  ToolbarModule,
  AccordionModule,
  ProgressSpinnerModule,
  TableModule,
  TagModule,
  DialogModule,
  MessageModule,
  TooltipModule,
  AutoCompleteModule,
  MenubarModule
]

@NgModule({
  declarations: [],
  imports: [
    ...PRIMENG_MODULES
  ],
  exports: [
    ...PRIMENG_MODULES
  ]
})
export class PrimeNgModule { }
