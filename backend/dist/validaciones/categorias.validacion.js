"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionActualizarCategoria = exports.validacionCrearCategoria = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validaciones para crear categoría
 */
exports.validacionCrearCategoria = [
    (0, express_validator_1.body)('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    (0, express_validator_1.body)('slug')
        .trim()
        .notEmpty()
        .withMessage('El slug es obligatorio')
        .isLength({ min: 2, max: 50 })
        .withMessage('El slug debe tener entre 2 y 50 caracteres')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('El slug solo puede contener letras minúsculas, números y guiones'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede superar 500 caracteres'),
    (0, express_validator_1.body)('color')
        .notEmpty()
        .withMessage('El color es obligatorio')
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('El color debe ser un código hexadecimal válido (#RRGGBB)'),
    (0, express_validator_1.body)('icono')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('El icono no puede superar 50 caracteres'),
    (0, express_validator_1.body)('orden')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El orden debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('El campo activo debe ser verdadero o falso'),
];
/**
 * Validaciones para actualizar categoría
 */
exports.validacionActualizarCategoria = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    (0, express_validator_1.body)('slug')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('El slug debe tener entre 2 y 50 caracteres')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('El slug solo puede contener letras minúsculas, números y guiones'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede superar 500 caracteres'),
    (0, express_validator_1.body)('color')
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('El color debe ser un código hexadecimal válido (#RRGGBB)'),
    (0, express_validator_1.body)('icono')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('El icono no puede superar 50 caracteres'),
    (0, express_validator_1.body)('orden')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El orden debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('El campo activo debe ser verdadero o falso'),
];
//# sourceMappingURL=categorias.validacion.js.map