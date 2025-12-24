import { Router } from 'express';
import { FlyersControlador } from '../controladores';
import {
  validacionCrearFlyer,
  validacionActualizarFlyer,
  validacionFiltrosFlyers,
} from '../validaciones';
import {
  verificarAutenticacion,
  autenticacionOpcional,
  esAdmin,
  manejarErroresValidacion,
  validarIdParametro,
  asyncHandler,
} from '../middlewares';
import { subirImagen } from '../middlewares/subir-archivos.middleware';

const router = Router();

router.get(
  '/destacados',
  asyncHandler(FlyersControlador.obtenerDestacados)
);

router.get(
  '/galeria',
  asyncHandler(FlyersControlador.obtenerGaleria)
);

router.get(
  '/',
  autenticacionOpcional,
  validacionFiltrosFlyers,
  manejarErroresValidacion,
  asyncHandler(FlyersControlador.listar)
);

router.get(
  '/:id',
  autenticacionOpcional,
  validarIdParametro('id'),
  asyncHandler(FlyersControlador.obtenerPorId)
);

router.post(
  '/',
  verificarAutenticacion,
  esAdmin,
  subirImagen,
  validacionCrearFlyer,
  manejarErroresValidacion,
  asyncHandler(FlyersControlador.crear)
);

router.put(
  '/:id',
  verificarAutenticacion,
  esAdmin,
  validarIdParametro('id'),
  subirImagen,
  validacionActualizarFlyer,
  manejarErroresValidacion,
  asyncHandler(FlyersControlador.actualizar)
);

router.delete(
  '/:id',
  verificarAutenticacion,
  esAdmin,
  validarIdParametro('id'),
  asyncHandler(FlyersControlador.eliminar)
);

export default router;