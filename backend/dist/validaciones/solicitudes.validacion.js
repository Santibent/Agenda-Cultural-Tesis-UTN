"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionFiltrosSolicitudes = exports.validacionCalificarSolicitud = exports.validacionActualizarEstadoSolicitud = exports.validacionActualizarSolicitud = exports.validacionCrearSolicitud = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validaciones para crear solicitud de flyer
 */
exports.validacionCrearSolicitud = [
    (0, express_validator_1.body)('nombreEvento')
        .trim()
        .notEmpty()
        .withMessage('El nombre del evento es obligatorio')
        .isLength({ min: 3, max: 200 })
        .withMessage('El nombre del evento debe tener entre 3 y 200 caracteres'),
    (0, express_validator_1.body)('tipoEvento')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('El tipo de evento no puede superar 100 caracteres'),
    (0, express_validator_1.body)('fechaEvento')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato YYYY-MM-DD)')
        .custom((value) => {
        const fecha = new Date(value);
        const ahora = new Date();
        if (fecha < ahora) {
            throw new Error('La fecha del evento no puede ser anterior a hoy');
        }
        return true;
    }),
    (0, express_validator_1.body)('descripcion')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ min: 20 })
        .withMessage('La descripción debe tener al menos 20 caracteres'),
    (0, express_validator_1.body)('referencias')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Las referencias no pueden superar 1000 caracteres'),
    (0, express_validator_1.body)('coloresPreferidos')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Los colores preferidos no pueden superar 200 caracteres'),
    (0, express_validator_1.body)('estiloPreferido')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('El estilo preferido no puede superar 200 caracteres'),
    (0, express_validator_1.body)('informacionIncluir')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La información a incluir no puede superar 1000 caracteres'),
    (0, express_validator_1.body)('presupuesto')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El presupuesto debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('contactoEmail')
        .trim()
        .notEmpty()
        .withMessage('El email de contacto es obligatorio')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('contactoTelefono')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Debe proporcionar un teléfono válido'),
    (0, express_validator_1.body)('contactoWhatsapp')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Debe proporcionar un WhatsApp válido'),
    (0, express_validator_1.body)('fechaLimite')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato YYYY-MM-DD)')
        .custom((value) => {
        const fecha = new Date(value);
        const ahora = new Date();
        if (fecha < ahora) {
            throw new Error('La fecha límite no puede ser anterior a hoy');
        }
        return true;
    }),
];
/**
 * Validaciones para actualizar solicitud (usuario)
 */
exports.validacionActualizarSolicitud = [
    (0, express_validator_1.body)('nombreEvento')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('El nombre del evento debe tener entre 3 y 200 caracteres'),
    (0, express_validator_1.body)('tipoEvento')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('El tipo de evento no puede superar 100 caracteres'),
    (0, express_validator_1.body)('fechaEvento')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato YYYY-MM-DD)'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .trim()
        .isLength({ min: 20 })
        .withMessage('La descripción debe tener al menos 20 caracteres'),
    (0, express_validator_1.body)('referencias')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Las referencias no pueden superar 1000 caracteres'),
    (0, express_validator_1.body)('coloresPreferidos')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Los colores preferidos no pueden superar 200 caracteres'),
    (0, express_validator_1.body)('estiloPreferido')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('El estilo preferido no puede superar 200 caracteres'),
    (0, express_validator_1.body)('informacionIncluir')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La información a incluir no puede superar 1000 caracteres'),
    (0, express_validator_1.body)('presupuesto')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El presupuesto debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('contactoEmail')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('contactoTelefono')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Debe proporcionar un teléfono válido'),
    (0, express_validator_1.body)('contactoWhatsapp')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Debe proporcionar un WhatsApp válido'),
    (0, express_validator_1.body)('fechaLimite')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato YYYY-MM-DD)'),
];
/**
 * Validaciones para actualizar estado de solicitud (admin)
 */
exports.validacionActualizarEstadoSolicitud = [
    (0, express_validator_1.body)('estado')
        .notEmpty()
        .withMessage('El estado es obligatorio')
        .isIn(['pendiente', 'revisando', 'en_proceso', 'completado', 'rechazado', 'cancelado'])
        .withMessage('Estado no válido'),
    (0, express_validator_1.body)('prioridad')
        .optional()
        .isIn(['baja', 'media', 'alta', 'urgente'])
        .withMessage('Prioridad no válida'),
    (0, express_validator_1.body)('notasAdmin')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Las notas del admin no pueden superar 2000 caracteres'),
];
/**
 * Validaciones para calificar solicitud
 */
exports.validacionCalificarSolicitud = [
    (0, express_validator_1.body)('calificacion')
        .notEmpty()
        .withMessage('La calificación es obligatoria')
        .isInt({ min: 1, max: 5 })
        .withMessage('La calificación debe ser un número entre 1 y 5'),
    (0, express_validator_1.body)('comentarioUsuario')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('El comentario no puede superar 1000 caracteres'),
];
/**
 * Validaciones para filtros de listado de solicitudes
 */
exports.validacionFiltrosSolicitudes = [
    (0, express_validator_1.query)('pagina')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número mayor a 0'),
    (0, express_validator_1.query)('limite')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('El límite debe estar entre 1 y 10000'),
    (0, express_validator_1.query)('estado')
        .optional()
        .isIn(['pendiente', 'revisando', 'en_proceso', 'completado', 'rechazado', 'cancelado'])
        .withMessage('Estado no válido'),
    (0, express_validator_1.query)('prioridad')
        .optional()
        .isIn(['baja', 'media', 'alta', 'urgente'])
        .withMessage('Prioridad no válida'),
    (0, express_validator_1.query)('ordenarPor')
        .optional()
        .isIn(['fechaEvento', 'fechaLimite', 'prioridad', 'createdAt'])
        .withMessage('Campo de ordenamiento no válido'),
    (0, express_validator_1.query)('orden')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('El orden debe ser ASC o DESC'),
];
//# sourceMappingURL=solicitudes.validacion.js.map