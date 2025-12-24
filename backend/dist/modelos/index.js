"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudFlyer = exports.Flyer = exports.Evento = exports.Categoria = exports.Usuario = void 0;
/**
 * Exportación centralizada de todos los modelos
 */
const usuario_modelo_1 = __importDefault(require("./usuario.modelo"));
exports.Usuario = usuario_modelo_1.default;
const categoria_modelo_1 = __importDefault(require("./categoria.modelo"));
exports.Categoria = categoria_modelo_1.default;
const evento_modelo_1 = __importDefault(require("./evento.modelo"));
exports.Evento = evento_modelo_1.default;
const flyer_modelo_1 = __importDefault(require("./flyer.modelo"));
exports.Flyer = flyer_modelo_1.default;
const solicitud_flyer_modelo_1 = __importDefault(require("./solicitud-flyer.modelo"));
exports.SolicitudFlyer = solicitud_flyer_modelo_1.default;
/**
 * Definir todas las asociaciones aquí para evitar dependencias circulares
 */
const definirAsociaciones = () => {
    // Categoría -> Eventos
    categoria_modelo_1.default.hasMany(evento_modelo_1.default, {
        foreignKey: 'categoriaId',
        as: 'eventos',
    });
    // Usuario -> Eventos creados
    usuario_modelo_1.default.hasMany(evento_modelo_1.default, {
        foreignKey: 'usuarioCreadorId',
        as: 'eventosCreados',
    });
    // Usuario -> Solicitudes
    usuario_modelo_1.default.hasMany(solicitud_flyer_modelo_1.default, {
        foreignKey: 'usuarioId',
        as: 'solicitudes',
    });
    // Evento -> Flyers
    evento_modelo_1.default.hasMany(flyer_modelo_1.default, {
        foreignKey: 'eventoRelacionadoId',
        as: 'flyers',
    });
};
// Ejecutar asociaciones
definirAsociaciones();
//# sourceMappingURL=index.js.map