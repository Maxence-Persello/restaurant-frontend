import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class AdminModule { }
