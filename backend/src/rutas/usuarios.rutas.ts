import { Router } from 'express';
import { UsuariosControlador } from '../controladores/usuarios.controlador';
import { verificarAutenticacion } from '../middlewares/autenticacion.middleware';
import { esAdmin } from '../middlewares/autorizacion.middleware';
import { validarActualizacionUsuario } from '../middlewares/validacion.middleware';

const router = Router();

router.get('/estadisticas', verificarAutenticacion, esAdmin, UsuariosControlador.obtenerEstadisticas);

router.get('/', verificarAutenticacion, esAdmin, UsuariosControlador.listar);

router.get('/:id', verificarAutenticacion, UsuariosControlador.obtenerPorId);

router.put(
  '/:id',
  verificarAutenticacion,
  validarActualizacionUsuario,
  UsuariosControlador.actualizar
);

router.delete('/:id', verificarAutenticacion, esAdmin, UsuariosControlador.eliminar);

router.patch('/:id/reactivar', verificarAutenticacion, esAdmin, UsuariosControlador.reactivar);

router.patch('/:id/cambiar-rol', verificarAutenticacion, esAdmin, UsuariosControlador.cambiarRol);

export default router;
