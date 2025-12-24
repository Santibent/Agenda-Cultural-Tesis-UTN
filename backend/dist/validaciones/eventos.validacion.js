"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionFiltrosEventos = exports.validacionActualizarEvento = exports.validacionCrearEvento = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validaciones para crear evento
 */
exports.validacionCrearEvento = [
    (0, express_validator_1.body)('titulo')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3, max: 200 })
        .withMessage('El título debe tener entre 3 y 200 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    (0, express_validator_1.body)('descripcionCorta')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción corta no puede superar 300 caracteres'),
    (0, express_validator_1.body)('categoriaId')
        .notEmpty()
        .withMessage('La categoría es obligatoria')
        .isInt({ min: 1 })
        .withMessage('Debe proporcionar un ID de categoría válido'),
    (0, express_validator_1.body)('fechaInicio')
        .notEmpty()
        .withMessage('La fecha de inicio es obligatoria')
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato ISO 8601)')
        .custom((value) => {
        const fecha = new Date(value);
        const ahora = new Date();
        if (fecha < ahora) {
            throw new Error('La fecha de inicio no puede ser anterior a hoy');
        }
        return true;
    }),
    (0, express_validator_1.body)('fechaFin')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato ISO 8601)')
        .custom((value, { req }) => {
        if (value && req.body.fechaInicio) {
            const fechaInicio = new Date(req.body.fechaInicio);
            const fechaFin = new Date(value);
            if (fechaFin < fechaInicio) {
                throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('horaInicio')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Debe proporcionar una hora válida (formato HH:MM)'),
    (0, express_validator_1.body)('horaFin')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Debe proporcionar una hora válida (formato HH:MM)'),
    (0, express_validator_1.body)('ubicacion')
        .trim()
        .notEmpty()
        .withMessage('La ubicación es obligatoria')
        .isLength({ max: 200 })
        .withMessage('La ubicación no puede superar 200 caracteres'),
    (0, express_validator_1.body)('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar 255 caracteres'),
    (0, express_validator_1.body)('ciudad')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La ciudad no puede superar 100 caracteres'),
    (0, express_validator_1.body)('provincia')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La provincia no puede superar 100 caracteres'),
    (0, express_validator_1.body)('pais')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('El país no puede superar 100 caracteres'),
    (0, express_validator_1.body)('latitud')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('La latitud debe ser un número entre -90 y 90'),
    (0, express_validator_1.body)('longitud')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('La longitud debe ser un número entre -180 y 180'),
    (0, express_validator_1.body)('precio')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('moneda')
        .optional()
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('La moneda debe ser ARS, USD o EUR'),
    (0, express_validator_1.body)('capacidad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La capacidad debe ser un número entero mayor a 0'),
    (0, express_validator_1.body)('linkExterno')
        .optional()
        .trim()
        .isURL()
        .withMessage('Debe proporcionar una URL válida'),
    (0, express_validator_1.body)('linkTickets')
        .optional()
        .trim()
        .isURL()
        .withMessage('Debe proporcionar una URL válida'),
    (0, express_validator_1.body)('organizador')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('El organizador no puede superar 200 caracteres'),
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
    (0, express_validator_1.body)('destacado')
        .optional()
        .isBoolean()
        .withMessage('El campo destacado debe ser verdadero o falso'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('El campo activo debe ser verdadero o falso'),
];
/**
 * Validaciones para actualizar evento
 */
exports.validacionActualizarEvento = [
    (0, express_validator_1.body)('titulo')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('El título debe tener entre 3 y 200 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    (0, express_validator_1.body)('descripcionCorta')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción corta no puede superar 300 caracteres'),
    (0, express_validator_1.body)('categoriaId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe proporcionar un ID de categoría válido'),
    (0, express_validator_1.body)('fechaInicio')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato ISO 8601)'),
    (0, express_validator_1.body)('fechaFin')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato ISO 8601)')
        .custom((value, { req }) => {
        if (value && req.body.fechaInicio) {
            const fechaInicio = new Date(req.body.fechaInicio);
            const fechaFin = new Date(value);
            if (fechaFin < fechaInicio) {
                throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('horaInicio')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Debe proporcionar una hora válida (formato HH:MM)'),
    (0, express_validator_1.body)('horaFin')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Debe proporcionar una hora válida (formato HH:MM)'),
    (0, express_validator_1.body)('ubicacion')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('La ubicación no puede superar 200 caracteres'),
    (0, express_validator_1.body)('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar 255 caracteres'),
    (0, express_validator_1.body)('precio')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número mayor o igual a 0'),
    (0, express_validator_1.body)('capacidad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La capacidad debe ser un número entero mayor a 0'),
    (0, express_validator_1.body)('linkExterno')
        .optional()
        .trim()
        .isURL()
        .withMessage('Debe proporcionar una URL válida'),
    (0, express_validator_1.body)('linkTickets')
        .optional()
        .trim()
        .isURL()
        .withMessage('Debe proporcionar una URL válida'),
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
    (0, express_validator_1.body)('destacado')
        .optional()
        .isBoolean()
        .withMessage('El campo destacado debe ser verdadero o falso'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('El campo activo debe ser verdadero o falso'),
];
/**
 * Validaciones para filtros de listado de eventos
 */
exports.validacionFiltrosEventos = [
    (0, express_validator_1.query)('pagina')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número mayor a 0'),
    (0, express_validator_1.query)('limite')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('El límite debe estar entre 1 y 10000'),
    (0, express_validator_1.query)('categoriaId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número válido'),
    (0, express_validator_1.query)('destacado')
        .optional()
        .isBoolean()
        .withMessage('El filtro destacado debe ser true o false'),
    (0, express_validator_1.query)('ciudad')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La ciudad no puede superar 100 caracteres'),
    (0, express_validator_1.query)('fechaDesde')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato ISO 8601)'),
    (0, express_validator_1.query)('fechaHasta')
        .optional()
        .isISO8601()
        .withMessage('Debe proporcionar una fecha válida (formato ISO 8601)'),
    (0, express_validator_1.query)('busqueda')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('La búsqueda no puede superar 200 caracteres'),
    (0, express_validator_1.query)('ordenarPor')
        .optional()
        .isIn(['fechaInicio', 'titulo', 'precio', 'vistas', 'createdAt'])
        .withMessage('Campo de ordenamiento no válido'),
    (0, express_validator_1.query)('orden')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('El orden debe ser ASC o DESC'),
];
//# sourceMappingURL=eventos.validacion.js.map