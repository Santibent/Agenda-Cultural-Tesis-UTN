import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  VERSION: 'v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTRO: '/auth/registro',
      PERFIL: '/auth/perfil',
      VERIFICAR_EMAIL: '/auth/verificar-email',
      RECUPERAR_PASSWORD: '/auth/recuperar-password',
      RESTABLECER_PASSWORD: '/auth/restablecer-password',
      CAMBIAR_PASSWORD: '/auth/cambiar-password',
      REFRESH_TOKEN: '/auth/refresh-token',
    },
    EVENTOS: {
      BASE: '/eventos',
      DESTACADOS: '/eventos/destacados',
      PROXIMOS: '/eventos/proximos',
    },
    CATEGORIAS: {
      BASE: '/categorias',
      CON_EVENTOS: '/categorias/con-eventos',
    },
    FLYERS: {
      BASE: '/flyers',
      DESTACADOS: '/flyers/destacados',
      GALERIA: '/flyers/galeria',
    },
    SOLICITUDES: {
      BASE: '/solicitudes',
      ESTADISTICAS: '/solicitudes/estadisticas',
    },
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};