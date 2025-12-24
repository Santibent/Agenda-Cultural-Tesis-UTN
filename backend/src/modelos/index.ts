
import Usuario from './usuario.modelo';
import Categoria from './categoria.modelo';
import Evento from './evento.modelo';
import Flyer from './flyer.modelo';
import SolicitudFlyer from './solicitud-flyer.modelo';

const definirAsociaciones = (): void => {
  
  Categoria.hasMany(Evento, {
    foreignKey: 'categoriaId',
    as: 'eventos',
  });

  Usuario.hasMany(Evento, {
    foreignKey: 'usuarioCreadorId',
    as: 'eventosCreados',
  });

  Usuario.hasMany(SolicitudFlyer, {
    foreignKey: 'usuarioId',
    as: 'solicitudes',
  });

  Evento.hasMany(Flyer, {
    foreignKey: 'eventoRelacionadoId',
    as: 'flyers',
  });
};

definirAsociaciones();

export {
  Usuario,
  Categoria,
  Evento,
  Flyer,
  SolicitudFlyer,
};