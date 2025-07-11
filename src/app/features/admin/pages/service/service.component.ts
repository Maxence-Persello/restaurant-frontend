import { Component, OnInit } from '@angular/core';
import { ServiceSlot, DAY_OF_WEEK_LABELS } from '../../../../core/models/service-slot.model';
import { ServiceSlotService } from '../../../../core/services/service-slot.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  services: ServiceSlot[] = [];
  isLoading = true;

  serviceDialogVisible = false;
  isEditMode = false;
  selectedServiceId: number | null = null;
  serviceForm: FormGroup;

  // Options for select
  dayOfWeekOptions = Object.values(DAY_OF_WEEK_LABELS).map((label, index) => ({
    label,
    value: index + 1
  }));

  serviceNameOptions = [
    { label: 'Matin', value: 'Matin' },
    { label: 'Midi', value: 'Midi' },
    { label: 'Soir', value: 'Soir' }
  ];

  // Filtered options for autocomplete
  filteredDayOfWeekOptions: any[] = [];
  filteredServiceNameOptions: any[] = [];

  constructor(
    readonly serviceSlotService: ServiceSlotService,
    readonly messageService: MessageService,
    readonly confirmationService: ConfirmationService,
    readonly fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      dayOfWeek: ['', Validators.required],
      name: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadServices();
    // Initialize filtered arrays
    this.filteredDayOfWeekOptions = [...this.dayOfWeekOptions];
    this.filteredServiceNameOptions = [...this.serviceNameOptions];
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceSlotService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Impossible de charger les services' 
        });
        this.isLoading = false;
      }
    });
  }

  openNewServiceDialog(): void {
    this.isEditMode = false;
    this.selectedServiceId = null;
    this.serviceForm.reset();
    this.serviceDialogVisible = true;
  }

  openEditServiceDialog(service: ServiceSlot): void {
    this.isEditMode = true;
    this.selectedServiceId = service.id;
    
    const nameOption = this.serviceNameOptions.find(option => option.value === service.name) || { label: service.name, value: service.name };
    
    this.serviceForm.setValue({
      dayOfWeek: service.dayOfWeek,
      name: nameOption,
      startTime: service.startTime,
      endTime: service.endTime
    });
    this.serviceDialogVisible = true;
  }

  hideServiceDialog(): void {
    this.serviceDialogVisible = false;
  }

  saveService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formValue = this.serviceForm.value;
    const serviceData = {
      dayOfWeek: typeof formValue.dayOfWeek === 'object' ? formValue.dayOfWeek.value : formValue.dayOfWeek,
      name: typeof formValue.name === 'object' ? formValue.name.value : formValue.name,
      startTime: formValue.startTime,
      endTime: formValue.endTime
    };

    const operation = this.isEditMode 
      ? this.serviceSlotService.updateService(this.selectedServiceId!, serviceData)
      : this.serviceSlotService.createService(serviceData);

    operation.subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Succès', 
          detail: `Service ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès` 
        });
        this.loadServices();
        this.hideServiceDialog();
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Une erreur est survenue lors de la sauvegarde' 
        });
      }
    });
  }

  deleteService(service: ServiceSlot): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le service "${service.name}" du ${DAY_OF_WEEK_LABELS[service.dayOfWeek]} ?`,
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
        this.serviceSlotService.deleteService(service.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Succès', 
              detail: 'Service supprimé avec succès' 
            });
            this.loadServices();
          },
          error: () => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erreur', 
              detail: 'Une erreur est survenue lors de la suppression' 
            });
          }
        });
      }
    });
  }

  getDayLabel(dayOfWeek: number): string {
    return DAY_OF_WEEK_LABELS[dayOfWeek];
  }

  // Computed property to get services grouped by day
  get servicesByDay(): { [key: string]: ServiceSlot[] } {
    const grouped: { [key: string]: ServiceSlot[] } = {};
    
    this.services.forEach(service => {
      const dayLabel = this.getDayLabel(service.dayOfWeek);
      if (!grouped[dayLabel]) {
        grouped[dayLabel] = [];
      }
      grouped[dayLabel].push(service);
    });

    // Sort services within each day by start time
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }

  get orderedDays(): string[] {
    const dayOrder = [
      'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
    ];
    return dayOrder.filter(day => this.servicesByDay[day] && this.servicesByDay[day].length > 0);
  }

  // Filter methods for autocomplete components
  filterDayOfWeek(event: any): void {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.dayOfWeekOptions.length; i++) {
      const option = this.dayOfWeekOptions[i];
      if (option.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(option);
      }
    }
    
    this.filteredDayOfWeekOptions = filtered;
  }

  filterServiceName(event: any): void {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.serviceNameOptions.length; i++) {
      const option = this.serviceNameOptions[i];
      if (option.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(option);
      }
    }
    
    this.filteredServiceNameOptions = filtered;
  }
}
