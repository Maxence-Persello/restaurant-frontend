import { Component, OnInit } from '@angular/core';
import { Room } from '../../../../core/models/room.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomService } from '../../../../core/services/room.service';
import { TableService } from '../../../../core/services/table.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-room',
  standalone: false,
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  rooms: Room[] = [];
  isLoading = true;

  roomDialogVisible = false;
  isEditMode = false;
  selectedRoomId: number | null = null;
  roomForm: FormGroup;

  loadingTablesForRoomId: number | null = null;

  constructor(
    readonly roomService: RoomService,
    readonly tableService: TableService,
    readonly messageService: MessageService,
    readonly confirmationService: ConfirmationService,
    readonly fb: FormBuilder
  ) {
    this.roomForm = this.fb.group({
      name: ['']
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.isLoading = false;
    });
  }

  openNewRoomDialog(): void {
    this.isEditMode = false;
    this.selectedRoomId = null;
    this.roomForm.reset();
    this.roomDialogVisible = true;
  }

  openEditRoomDialog(room: Room): void {
    this.isEditMode = true;
    this.selectedRoomId = room.id;
    this.roomForm.setValue({ name: room.name });
    this.roomDialogVisible = true;
  }

  hideRoomDialog(): void {
    this.roomDialogVisible = false;
  }

  saveRoom(): void {
    if (this.roomForm.invalid) {
      return;
    }

    const roomData = this.roomForm.value;

    const operation = this.isEditMode ? this.roomService.updateRoom(this.selectedRoomId!, roomData) : this.roomService.createRoom(roomData);

    operation.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: `Salle ${this.isEditMode ? 'modifiée' : 'ajoutée'} avec succès` });
        this.loadRooms();
        this.hideRoomDialog();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue' });
      }
    });
  }

  deleteRoom(room: Room): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la salle "${room.name}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roomService.deleteRoom(room.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Salle supprimée avec succès' });
            this.loadRooms();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue' });
          }
        });
      }
    });
  }

  onRoomExpand(room: Room): void {
    if (!room.tables) {
      this.loadingTablesForRoomId = room.id;
      this.tableService.getTablesForRoom(room.id).subscribe(tables => {
        room.tables = tables;
        this.loadingTablesForRoomId = null;
      });
    }
  }

  openNewTableDialog(roomId: number) {
    // Logic to open the dialog for creating a new table
  }

}
