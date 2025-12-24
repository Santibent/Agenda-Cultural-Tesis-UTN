import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services';
import { Usuario } from '../../shared/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  
  authService = inject(AuthService);

  menuAbierto = signal<boolean>(false);
  usuario: any;
  estaAutenticado: any;
  esAdmin: any;

  constructor() {
    this.usuario = this.authService.usuario;
    this.estaAutenticado = this.authService.estaAutenticado;
    this.esAdmin = this.authService.esAdmin;
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.menuAbierto.update(valor => !valor);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  logout(): void {
    this.authService.cerrarSesion();
    this.cerrarMenu();
  }
}