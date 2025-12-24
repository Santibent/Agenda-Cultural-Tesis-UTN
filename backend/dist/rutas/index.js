"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_rutas_1 = __importDefault(require("./autenticacion.rutas"));
const eventos_rutas_1 = __importDefault(require("./eventos.rutas"));
const solicitudes_rutas_1 = __importDefault(require("./solicitudes.rutas"));
const categorias_rutas_1 = __importDefault(require("./categorias.rutas"));
const flyers_rutas_1 = __importDefault(require("./flyers.rutas"));
const router = (0, express_1.Router)();
/**
 * Configurar rutas de la API
 */
router.use('/auth', autenticacion_rutas_1.default);
router.use('/eventos', eventos_rutas_1.default);
router.use('/solicitudes', solicitudes_rutas_1.default);
router.use('/categorias', categorias_rutas_1.default);
router.use('/flyers', flyers_rutas_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map