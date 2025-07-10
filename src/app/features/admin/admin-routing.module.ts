import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  { path: 'room', component: RoomComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: 'room', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
