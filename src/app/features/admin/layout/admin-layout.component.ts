import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeMenu();
  }

  private initializeMenu(): void {
    this.menuItems = [
      {
        label: 'Gestion des Salles',
        icon: 'pi pi-home',
        routerLink: '/admin/room',
        routerLinkActiveOptions: { exact: false }
      },
      {
        label: 'Gestion des Services',
        icon: 'pi pi-clock',
        routerLink: '/admin/service',
        routerLinkActiveOptions: { exact: false }
      },
      // Add more menu items as needed
      {
        label: 'Réservations',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'Voir les réservations',
            icon: 'pi pi-list',
            // routerLink: '/admin/reservations'
            command: () => this.showNotImplemented()
          },
          {
            label: 'Nouvelle réservation',
            icon: 'pi pi-plus',
            // routerLink: '/admin/reservations/new'
            command: () => this.showNotImplemented()
          }
        ]
      },
      {
        label: 'Rapports',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Statistiques',
            icon: 'pi pi-chart-line',
            command: () => this.showNotImplemented()
          },
          {
            label: 'Revenus',
            icon: 'pi pi-dollar',
            command: () => this.showNotImplemented()
          }
        ]
      }
    ];
  }

  showUserMenu(event: any): void {
    // This could show a user profile menu
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Profil Admin', 
      detail: 'Fonctionnalité à venir' 
    });
  }

  logout(): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      header: 'Déconnexion',
      icon: 'pi pi-sign-out',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        severity: 'secondary',
        label: 'Annuler',
        outline: true
      },
      acceptLabel: 'Déconnecter',
      acceptButtonProps: {
        severity: 'danger',
        label: 'Déconnecter'
      },
      accept: () => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Déconnexion', 
          detail: 'Vous avez été déconnecté avec succès' 
        });
      }
    });
  }

  private showNotImplemented(): void {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Fonctionnalité non implémentée', 
      detail: 'Cette fonctionnalité sera disponible prochainement' 
    });
  }
}
