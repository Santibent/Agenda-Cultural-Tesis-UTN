import { Router } from 'express';
import { SolicitudesControlador } from '../controladores';
import {
  validacionCrearSolicitud,
  validacionActualizarSolicitud,
  validacionActualizarEstadoSolicitud,
  validacionCalificarSolicitud,
  validacionFiltrosSolicitudes,
} from '../validaciones';
import {
  verificarAutenticacion,
  esAdmin,
  manejarErroresValidacion,
  validarIdParametro,
  asyncHandler,
  limitadorCreacion,
} from '../middlewares';

const router = Router();

router.get(
  '/estadisticas',
  verificarAutenticacion,
  esAdmin,
  asyncHandler(SolicitudesControlador.obtenerEstadisticas)
);

router.get(
  '/',
  verificarAutenticacion,
  validacionFiltrosSolicitudes,
  manejarErroresValidacion,
  asyncHandler(SolicitudesControlador.listar)
);

router.get(
  '/:id',
  verificarAutenticacion,
  validarIdParametro('id'),
  asyncHandler(SolicitudesControlador.obtenerPorId)
);

router.post(
  '/',
  verificarAutenticacion,
  limitadorCreacion,
  validacionCrearSolicitud,
  manejarErroresValidacion,
  asyncHandler(SolicitudesControlador.crear)
);

router.put(
  '/:id',
  verificarAutenticacion,
  validarIdParametro('id'),
  validacionActualizarSolicitud,
  manejarErroresValidacion,
  asyncHandler(SolicitudesControlador.actualizar)
);

router.patch(
  '/:id/estado',
  verificarAutenticacion,
  esAdmin,
  validarIdParametro('id'),
  validacionActualizarEstadoSolicitud,
  manejarErroresValidacion,
  asyncHandler(SolicitudesControlador.actualizarEstado)
);

router.patch(
  '/:id/cancelar',
  verificarAutenticacion,
  validarIdParametro('id'),
  asyncHandler(SolicitudesControlador.cancelar)
);

router.post(
  '/:id/calificar',
  verificarAutenticacion,
  validarIdParametro('id'),
  validacionCalificarSolicitud,
  manejarErroresValidacion,
  asyncHandler(SolicitudesControlador.calificar)
);

router.delete(
  '/:id',
  verificarAutenticacion,
  validarIdParametro('id'),
  asyncHandler(SolicitudesControlador.eliminar)
);

export default router;