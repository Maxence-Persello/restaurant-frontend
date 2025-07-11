import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { AdminGuard } from '../../core/guards/admin.guard';
import { ServiceComponent } from './pages/service/service.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'room', pathMatch: 'full' },
      { path: 'room', component: RoomComponent },
      { path: 'service', component: ServiceComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
