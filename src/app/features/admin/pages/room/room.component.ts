import { Component, OnInit } from '@angular/core';
import { Room } from '../../../../core/models/room.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomService } from '../../../../core/services/room.service';
import { TableService } from '../../../../core/services/table.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from '../../../../core/models/table.model';

@Component({
  selector: 'app-room',
  standalone: false,
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  rooms: Room[] = [];
  tables: { [roomId: number]: Table[] } = {};

  isLoading = true;

  roomDialogVisible = false;
  isEditMode = false;
  selectedRoomId: number | null = null;
  roomForm: FormGroup;

  tableDialogVisible = false;
  isTableEditMode = false;
  selectedTableId: number | null = null;
  tableForm: FormGroup;

  loadingTablesForRoomId: number | null = null;

  layoutEditorVisible = false;
  selectedRoomForLayout: Room | null = null;

  openedAccordion: any = null;

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
    this.tableForm = this.fb.group({
      name: [''],
      seats: [0],
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
        if (this.isEditMode) {
          this.loadRoom(this.selectedRoomId!);
        } else {
          this.loadRooms();
        }
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
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        severity: 'secondary',
        label: 'Annuler',
        outline: true
      },
      rejectLabel: 'Annuler',
      acceptButtonProps: {
        severity: 'danger',
        label: 'Supprimer'
      },
      acceptLabel: 'Supprimer',
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
    console.log('Room expanded:', room);
    this.loadTablesForRoom(room);
  }

  loadRoom(roomId: number): void {
    this.roomService.getRoom(roomId).subscribe(room => {
      const foundRoomIndex = this.rooms.findIndex(r => r.id === roomId);
      if (foundRoomIndex !== -1) {
        this.rooms[foundRoomIndex] = room;
      }
    });
  }

  loadTablesForRoom(room: Room): void {
    this.loadTablesForRoomId(room.id);
  }

  loadTablesForRoomId(roomId: number): void {
    if (!this.tables[roomId] || !this.tables[roomId].length) {
      this.loadingTablesForRoomId = roomId;
      this.tableService.getTablesForRoom(roomId).subscribe(tables => {
        console.log('Tables for room:', roomId, tables);
        if (tables.length) {
          const foundRoom = this.rooms.find(r => r.id === roomId);
          if (foundRoom) {
            this.tables[roomId] = tables;
          }
        }
        this.loadingTablesForRoomId = null;
      });
    }
  }

  onAccordionOpen(event: any): void {
    console.log('Accordion opened:', event);
    const expandedRoomId = event.index;
    const room = this.rooms.find(r => r.id === expandedRoomId);
    if (room) {
      this.onRoomExpand(room);
    }
  }

  openNewTableDialog(roomId: number) {
    this.isTableEditMode = false;
    this.selectedTableId = null;
    this.tableForm.reset();
    this.tableDialogVisible = true;
  }

  openEditTableDialog(table: Table): void {
    this.isTableEditMode = true;
    this.selectedTableId = table.id;
    this.tableForm.setValue({ name: table.name, seats: table.seats });
    this.tableDialogVisible = true;
  }

  hideTableDialog(): void {
    this.tableDialogVisible = false;
  }

  saveTable(): void {
    if (this.tableForm.invalid) {
      return;
    }

    const tableData = this.tableForm.value;

    const operation = this.isTableEditMode ? this.tableService.updateTable(this.selectedTableId!, tableData) : this.tableService.createTable(tableData);

    operation.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: `Table ${this.isTableEditMode ? 'modifiée' : 'ajoutée'} avec succès` });
        this.loadTablesForRoomId(this.selectedRoomId!);
        this.hideTableDialog();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue' });
      }
    });
  }

  deleteTable(table: Table): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la table "${table.name}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        severity: 'secondary',
        label: 'Annuler',
        outline: true
      },
      rejectLabel: 'Annuler',
      acceptButtonProps: {
        severity: 'danger',
        label: 'Supprimer'
      },
      acceptLabel: 'Supprimer',
      accept: () => {
        this.tableService.deleteTable(table.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Table supprimée avec succès' });
            this.loadRooms();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue' });
          }
        });
      }
    });
  }
}
