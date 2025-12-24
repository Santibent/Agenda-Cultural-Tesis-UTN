"use strict";
/**
 * Enumeraciones del sistema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoMoneda = exports.PrioridadSolicitud = exports.EstadoSolicitudFlyer = exports.RolUsuario = void 0;
var RolUsuario;
(function (RolUsuario) {
    RolUsuario["ADMIN"] = "admin";
    RolUsuario["USUARIO"] = "usuario";
})(RolUsuario || (exports.RolUsuario = RolUsuario = {}));
var EstadoSolicitudFlyer;
(function (EstadoSolicitudFlyer) {
    EstadoSolicitudFlyer["PENDIENTE"] = "pendiente";
    EstadoSolicitudFlyer["REVISANDO"] = "revisando";
    EstadoSolicitudFlyer["EN_PROCESO"] = "en_proceso";
    EstadoSolicitudFlyer["COMPLETADO"] = "completado";
    EstadoSolicitudFlyer["RECHAZADO"] = "rechazado";
    EstadoSolicitudFlyer["CANCELADO"] = "cancelado";
})(EstadoSolicitudFlyer || (exports.EstadoSolicitudFlyer = EstadoSolicitudFlyer = {}));
var PrioridadSolicitud;
(function (PrioridadSolicitud) {
    PrioridadSolicitud["BAJA"] = "baja";
    PrioridadSolicitud["MEDIA"] = "media";
    PrioridadSolicitud["ALTA"] = "alta";
    PrioridadSolicitud["URGENTE"] = "urgente";
})(PrioridadSolicitud || (exports.PrioridadSolicitud = PrioridadSolicitud = {}));
var TipoMoneda;
(function (TipoMoneda) {
    TipoMoneda["ARS"] = "ARS";
    TipoMoneda["USD"] = "USD";
    TipoMoneda["EUR"] = "EUR";
})(TipoMoneda || (exports.TipoMoneda = TipoMoneda = {}));
//# sourceMappingURL=enums.js.map