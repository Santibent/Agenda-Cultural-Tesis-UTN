"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionCambiarPassword = exports.validacionRestablecerPassword = exports.validacionRecuperacionPassword = exports.validacionLogin = exports.validacionRegistro = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validaciones para registro de usuario
 */
exports.validacionRegistro = [
    (0, express_validator_1.body)('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),
    (0, express_validator_1.body)('confirmarPassword')
        .notEmpty()
        .withMessage('Debe confirmar la contraseña')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden'),
];
/**
 * Validaciones para login
 */
exports.validacionLogin = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
];
/**
 * Validaciones para recuperación de contraseña
 */
exports.validacionRecuperacionPassword = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
];
/**
 * Validaciones para restablecer contraseña
 */
exports.validacionRestablecerPassword = [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('El token es obligatorio'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),
    (0, express_validator_1.body)('confirmarPassword')
        .notEmpty()
        .withMessage('Debe confirmar la contraseña')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden'),
];
/**
 * Validaciones para cambiar contraseña
 */
exports.validacionCambiarPassword = [
    (0, express_validator_1.body)('passwordActual')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria'),
    (0, express_validator_1.body)('passwordNueva')
        .notEmpty()
        .withMessage('La contraseña nueva es obligatoria')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial')
        .custom((value, { req }) => value !== req.body.passwordActual)
        .withMessage('La nueva contraseña debe ser diferente a la actual'),
    (0, express_validator_1.body)('confirmarPasswordNueva')
        .notEmpty()
        .withMessage('Debe confirmar la nueva contraseña')
        .custom((value, { req }) => value === req.body.passwordNueva)
        .withMessage('Las contraseñas no coinciden'),
];
//# sourceMappingURL=autenticacion.validacion.js.map