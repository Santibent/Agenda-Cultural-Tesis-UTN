import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, AuthService, EstadisticasUsuarios, UsuariosListadoParams, NotificationService } from '../../../core/services';
import { Usuario } from '../../../shared/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  
  cargando = signal<boolean>(true);
  usuarios = signal<Usuario[]>([]);
  estadisticas = signal<EstadisticasUsuarios | null>(null);
  paginacion = signal<any>(null);

  filtros: UsuariosListadoParams = {
    pagina: 1,
    limite: 20,
    ordenarPor: 'createdAt',
    orden: 'DESC'
  };

  mostrarModal = signal<boolean>(false);
  usuarioSeleccionado = signal<Usuario | null>(null);
  accionModal: 'editar' | 'eliminar' | 'reactivar' | 'cambiarRol' = 'editar';

  formulario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario' as 'admin' | 'usuario',
    activo: true
  };

  nuevoRol: 'admin' | 'usuario' = 'usuario';

  constructor(
    private usuariosService: UsuariosService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    this.usuariosService.obtenerEstadisticas().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.estadisticas.set(response.datos);
        }
      }
    });

    this.usuariosService.listar(this.filtros).subscribe({
      next: (response) => {
        if (response.exito) {
          this.usuarios.set(response.datos || []);
          this.paginacion.set(response.meta);
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  buscar(termino: string): void {
    this.filtros.busqueda = termino || undefined;
    this.filtros.pagina = 1;
    this.cargarDatos();
  }

  filtrarPorRol(rol: string): void {
    this.filtros.rol = rol === 'todos' ? undefined : (rol as 'admin' | 'usuario');
    this.filtros.pagina = 1;
    this.cargarDatos();
  }

  filtrarPorEstado(estado: string): void {
    if (estado === 'todos') {
      this.filtros.activo = undefined;
    } else {
      this.filtros.activo = estado === 'activos';
    }
    this.filtros.pagina = 1;
    this.cargarDatos();
  }

  cambiarPagina(pagina: number): void {
    this.filtros.pagina = pagina;
    this.cargarDatos();
  }

  abrirModalEditar(usuario: Usuario): void {
    this.usuarioSeleccionado.set(usuario);
    this.accionModal = 'editar';
    this.formulario = {
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol,
      activo: usuario.activo
    };
    this.mostrarModal.set(true);
  }

  abrirModalEliminar(usuario: Usuario): void {
    this.usuarioSeleccionado.set(usuario);
    this.accionModal = 'eliminar';
    this.mostrarModal.set(true);
  }

  abrirModalReactivar(usuario: Usuario): void {
    this.usuarioSeleccionado.set(usuario);
    this.accionModal = 'reactivar';
    this.mostrarModal.set(true);
  }

  abrirModalCambiarRol(usuario: Usuario): void {
    this.usuarioSeleccionado.set(usuario);
    this.accionModal = 'cambiarRol';
    this.nuevoRol = usuario.rol === 'admin' ? 'usuario' : 'admin';
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.usuarioSeleccionado.set(null);
  }

  guardarUsuario(): void {
    const usuario = this.usuarioSeleccionado();
    if (!usuario) return;

    const datos: any = {
      nombre: this.formulario.nombre,
      email: this.formulario.email,
      rol: this.formulario.rol,
      activo: this.formulario.activo
    };

    if (this.formulario.password) {
      datos.password = this.formulario.password;
    }

    this.usuariosService.actualizar(usuario.id, datos).subscribe({
      next: (response) => {
        if (response.exito) {
          this.notificationService.success('Usuario actualizado', 'Los cambios se guardaron correctamente');
          this.cargarDatos();
          this.cerrarModal();
        }
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.notificationService.error('Error', 'No se pudo actualizar el usuario');
      }
    });
  }

  eliminarUsuario(): void {
    const usuario = this.usuarioSeleccionado();
    if (!usuario) return;

    this.usuariosService.eliminar(usuario.id).subscribe({
      next: (response) => {
        if (response.exito) {
          this.notificationService.success('Usuario desactivado', 'El usuario ha sido desactivado correctamente');
          this.cargarDatos();
          this.cerrarModal();
        }
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.notificationService.error('Error', 'No se pudo desactivar el usuario');
      }
    });
  }

  reactivarUsuario(): void {
    const usuario = this.usuarioSeleccionado();
    if (!usuario) return;

    this.usuariosService.reactivar(usuario.id).subscribe({
      next: (response) => {
        if (response.exito) {
          this.notificationService.success('Usuario reactivado', 'El usuario ha sido reactivado correctamente');
          this.cargarDatos();
          this.cerrarModal();
        }
      },
      error: (error) => {
        console.error('Error al reactivar usuario:', error);
        this.notificationService.error('Error', 'No se pudo reactivar el usuario');
      }
    });
  }

  cambiarRolUsuario(): void {
    const usuario = this.usuarioSeleccionado();
    if (!usuario) return;

    this.usuariosService.cambiarRol(usuario.id, this.nuevoRol).subscribe({
      next: (response) => {
        if (response.exito) {
          this.notificationService.success('Rol actualizado', `El rol se cambió a ${this.obtenerRolLabel(this.nuevoRol)}`);
          this.cargarDatos();
          this.cerrarModal();
        }
      },
      error: (error) => {
        console.error('Error al cambiar rol:', error);
        this.notificationService.error('Error', 'No se pudo cambiar el rol del usuario');
      }
    });
  }

  obtenerRolLabel(rol: string): string {
    return rol === 'admin' ? 'Administrador' : 'Usuario';
  }

  obtenerRolBadgeClass(rol: string): string {
    return rol === 'admin' ? 'badge bg-danger' : 'badge bg-primary';
  }

  obtenerEstadoBadgeClass(activo: boolean): string {
    return activo ? 'badge bg-success' : 'badge bg-secondary';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
