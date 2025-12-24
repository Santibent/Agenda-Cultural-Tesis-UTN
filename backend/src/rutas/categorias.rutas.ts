import { Router } from 'express';
import { CategoriasControlador } from '../controladores';
import {
  validacionCrearCategoria,
  validacionActualizarCategoria,
} from '../validaciones';
import {
  verificarAutenticacion,
  esAdmin,
  manejarErroresValidacion,
  validarIdParametro,
  asyncHandler,
} from '../middlewares';

const router = Router();

router.get(
  '/con-eventos',
  asyncHandler(CategoriasControlador.listarConEventos)
);

router.get(
  '/',
  asyncHandler(CategoriasControlador.listar)
);

router.get(
  '/:idOSlug',
  asyncHandler(CategoriasControlador.obtenerPorId)
);

router.post(
  '/',
  verificarAutenticacion,
  esAdmin,
  validacionCrearCategoria,
  manejarErroresValidacion,
  asyncHandler(CategoriasControlador.crear)
);

router.put(
  '/:id',
  verificarAutenticacion,
  esAdmin,
  validarIdParametro('id'),
  validacionActualizarCategoria,
  manejarErroresValidacion,
  asyncHandler(CategoriasControlador.actualizar)
);

router.delete(
  '/:id',
  verificarAutenticacion,
  esAdmin,
  validarIdParametro('id'),
  asyncHandler(CategoriasControlador.eliminar)
);

export default router;