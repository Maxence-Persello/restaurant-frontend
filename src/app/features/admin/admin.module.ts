import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceComponent } from './pages/service/service.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';

@NgModule({
  declarations: [
    RoomComponent,
    ServiceComponent,
    AdminLayoutComponent
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
