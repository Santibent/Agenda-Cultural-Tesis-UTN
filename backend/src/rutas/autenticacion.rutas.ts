import { Router } from 'express';
import { AutenticacionControlador } from '../controladores';
import {
  validacionRegistro,
  validacionLogin,
  validacionRecuperacionPassword,
  validacionRestablecerPassword,
  validacionCambiarPassword,
} from '../validaciones';
import {
  verificarAutenticacion,
  manejarErroresValidacion,
  asyncHandler,
  limitadorRegistro,
  limitadorAutenticacion,
  limitadorRecuperacion,
  limitadorEmails,
} from '../middlewares';

const router = Router();

router.post(
  '/registro',
  limitadorRegistro,
  validacionRegistro,
  manejarErroresValidacion,
  asyncHandler(AutenticacionControlador.registro)
);

router.post(
  '/login',
  limitadorAutenticacion,
  validacionLogin,
  manejarErroresValidacion,
  asyncHandler(AutenticacionControlador.login)
);

router.get(
  '/perfil',
  verificarAutenticacion,
  asyncHandler(AutenticacionControlador.obtenerPerfil)
);

router.put(
  '/perfil',
  verificarAutenticacion,
  asyncHandler(AutenticacionControlador.actualizarPerfil)
);

router.get(
  '/verificar-email',
  asyncHandler(AutenticacionControlador.verificarEmail)
);

router.post(
  '/verificar-email',
  asyncHandler(AutenticacionControlador.verificarEmail)
);

router.post(
  '/reenviar-verificacion',
  limitadorEmails,
  asyncHandler(AutenticacionControlador.reenviarVerificacion)
);

router.post(
  '/recuperar-password',
  limitadorRecuperacion,
  validacionRecuperacionPassword,
  manejarErroresValidacion,
  asyncHandler(AutenticacionControlador.recuperarPassword)
);

router.post(
  '/restablecer-password',
  validacionRestablecerPassword,
  manejarErroresValidacion,
  asyncHandler(AutenticacionControlador.restablecerPassword)
);

router.post(
  '/cambiar-password',
  verificarAutenticacion,
  validacionCambiarPassword,
  manejarErroresValidacion,
  asyncHandler(AutenticacionControlador.cambiarPassword)
);

router.post(
  '/refresh-token',
  asyncHandler(AutenticacionControlador.refrescarToken)
);

export default router;