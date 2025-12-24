"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionFiltrosFlyers = exports.validacionActualizarFlyer = exports.validacionCrearFlyer = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validaciones para crear flyer
 */
exports.validacionCrearFlyer = [
    (0, express_validator_1.body)('titulo')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3, max: 200 })
        .withMessage('El título debe tener entre 3 y 200 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede superar 1000 caracteres'),
    (0, express_validator_1.body)('eventoRelacionadoId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe proporcionar un ID de evento válido'),
    (0, express_validator_1.body)('etiquetas')
        .optional()
        .custom((value) => {
        // Allow both array and JSON string
        if (Array.isArray(value)) {
            return true;
        }
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return true;
                }
            }
            catch (e) {
                // Not a JSON string, that's ok - might be empty
            }
        }
        return true;
    })
        .withMessage('Las etiquetas deben ser un array o un JSON string'),
    (0, express_validator_1.body)('orden')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El orden debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('visible')
        .optional()
        .isBoolean()
        .withMessage('El campo visible debe ser verdadero o falso'),
    (0, express_validator_1.body)('destacado')
        .optional()
        .isBoolean()
        .withMessage('El campo destacado debe ser verdadero o falso'),
];
/**
 * Validaciones para actualizar flyer
 */
exports.validacionActualizarFlyer = [
    (0, express_validator_1.body)('titulo')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('El título debe tener entre 3 y 200 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede superar 1000 caracteres'),
    (0, express_validator_1.body)('eventoRelacionadoId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe proporcionar un ID de evento válido'),
    (0, express_validator_1.body)('etiquetas')
        .optional()
        .custom((value) => {
        // Allow both array and JSON string
        if (Array.isArray(value)) {
            return true;
        }
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return true;
                }
            }
            catch (e) {
                // Not a JSON string, that's ok - might be empty
            }
        }
        return true;
    })
        .withMessage('Las etiquetas deben ser un array o un JSON string'),
    (0, express_validator_1.body)('orden')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El orden debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('visible')
        .optional()
        .isBoolean()
        .withMessage('El campo visible debe ser verdadero o falso'),
    (0, express_validator_1.body)('destacado')
        .optional()
        .isBoolean()
        .withMessage('El campo destacado debe ser verdadero o falso'),
];
/**
 * Validaciones para filtros de listado de flyers
 */
exports.validacionFiltrosFlyers = [
    (0, express_validator_1.query)('pagina')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número mayor a 0'),
    (0, express_validator_1.query)('limite')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('El límite debe estar entre 1 y 10000'),
    (0, express_validator_1.query)('visible')
        .optional()
        .isBoolean()
        .withMessage('El filtro visible debe ser true o false'),
    (0, express_validator_1.query)('destacado')
        .optional()
        .isBoolean()
        .withMessage('El filtro destacado debe ser true o false'),
    (0, express_validator_1.query)('eventoRelacionadoId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de evento debe ser un número válido'),
    (0, express_validator_1.query)('ordenarPor')
        .optional()
        .isIn(['orden', 'vistas', 'createdAt'])
        .withMessage('Campo de ordenamiento no válido'),
    (0, express_validator_1.query)('orden')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('El orden debe ser ASC o DESC'),
];
//# sourceMappingURL=flyers.validacion.js.map