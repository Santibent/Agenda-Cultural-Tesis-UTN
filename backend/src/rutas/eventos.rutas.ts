import { Router } from 'express';
import { EventosControlador } from '../controladores';
import {
  validacionCrearEvento,
  validacionActualizarEvento,
  validacionFiltrosEventos,
} from '../validaciones';
import {
  verificarAutenticacion,
  manejarErroresValidacion,
  validarIdParametro,
  sanitizarBusqueda,
  asyncHandler,
  limitadorCreacion,
} from '../middlewares';
import { subirImagen } from '../middlewares/subir-archivos.middleware';

const router = Router();

router.get(
  '/destacados',
  asyncHandler(EventosControlador.obtenerDestacados)
);

router.get(
  '/proximos',
  asyncHandler(EventosControlador.obtenerProximos)
);

router.get(
  '/',
  validacionFiltrosEventos,
  manejarErroresValidacion,
  sanitizarBusqueda,
  asyncHandler(EventosControlador.listar)
);

router.get(
  '/:idOSlug',
  asyncHandler(EventosControlador.obtenerPorId)
);

router.post(
  '/',
  verificarAutenticacion,
  limitadorCreacion,
  subirImagen,
  validacionCrearEvento,
  manejarErroresValidacion,
  asyncHandler(EventosControlador.crear)
);

router.put(
  '/:id',
  verificarAutenticacion,
  validarIdParametro('id'),
  subirImagen,
  validacionActualizarEvento,
  manejarErroresValidacion,
  asyncHandler(EventosControlador.actualizar)
);

router.delete(
  '/:id',
  verificarAutenticacion,
  validarIdParametro('id'),
  asyncHandler(EventosControlador.eliminar)
);

export default router;