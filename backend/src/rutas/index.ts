import { Router } from 'express';
import autenticacionRutas from './autenticacion.rutas';
import eventosRutas from './eventos.rutas';
import solicitudesRutas from './solicitudes.rutas';
import categoriasRutas from './categorias.rutas';
import flyersRutas from './flyers.rutas';
import usuariosRutas from './usuarios.rutas';

const router = Router();

router.use('/auth', autenticacionRutas);
router.use('/eventos', eventosRutas);
router.use('/solicitudes', solicitudesRutas);
router.use('/categorias', categoriasRutas);
router.use('/flyers', flyersRutas);
router.use('/usuarios', usuariosRutas);

export default router;