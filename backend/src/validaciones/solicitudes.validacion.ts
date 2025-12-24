import { body, query } from 'express-validator';

export const validacionCrearSolicitud = [
  body('nombreEvento')
    .trim()
    .notEmpty()
    .withMessage('El nombre del evento es obligatorio')
    .isLength({ min: 3, max: 200 })
    .withMessage('El nombre del evento debe tener entre 3 y 200 caracteres'),

  body('tipoEvento')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El tipo de evento no puede superar 100 caracteres'),

  body('fechaEvento')
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

  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 20 })
    .withMessage('La descripción debe tener al menos 20 caracteres'),

  body('referencias')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las referencias no pueden superar 1000 caracteres'),

  body('coloresPreferidos')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Los colores preferidos no pueden superar 200 caracteres'),

  body('estiloPreferido')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('El estilo preferido no puede superar 200 caracteres'),

  body('informacionIncluir')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La información a incluir no puede superar 1000 caracteres'),

  body('presupuesto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número mayor o igual a 0'),

  body('contactoEmail')
    .trim()
    .notEmpty()
    .withMessage('El email de contacto es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('contactoTelefono')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Debe proporcionar un teléfono válido'),

  body('contactoWhatsapp')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Debe proporcionar un WhatsApp válido'),

  body('fechaLimite')
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

export const validacionActualizarSolicitud = [
  body('nombreEvento')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El nombre del evento debe tener entre 3 y 200 caracteres'),

  body('tipoEvento')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El tipo de evento no puede superar 100 caracteres'),

  body('fechaEvento')
    .optional()
    .isISO8601()
    .withMessage('Debe proporcionar una fecha válida (formato YYYY-MM-DD)'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage('La descripción debe tener al menos 20 caracteres'),

  body('referencias')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las referencias no pueden superar 1000 caracteres'),

  body('coloresPreferidos')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Los colores preferidos no pueden superar 200 caracteres'),

  body('estiloPreferido')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('El estilo preferido no puede superar 200 caracteres'),

  body('informacionIncluir')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La información a incluir no puede superar 1000 caracteres'),

  body('presupuesto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número mayor o igual a 0'),

  body('contactoEmail')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('contactoTelefono')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Debe proporcionar un teléfono válido'),

  body('contactoWhatsapp')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Debe proporcionar un WhatsApp válido'),

  body('fechaLimite')
    .optional()
    .isISO8601()
    .withMessage('Debe proporcionar una fecha válida (formato YYYY-MM-DD)'),
];

export const validacionActualizarEstadoSolicitud = [
  body('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .isIn(['pendiente', 'revisando', 'en_proceso', 'completado', 'rechazado', 'cancelado'])
    .withMessage('Estado no válido'),

  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'urgente'])
    .withMessage('Prioridad no válida'),

  body('notasAdmin')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Las notas del admin no pueden superar 2000 caracteres'),
];

export const validacionCalificarSolicitud = [
  body('calificacion')
    .notEmpty()
    .withMessage('La calificación es obligatoria')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5'),

  body('comentarioUsuario')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('El comentario no puede superar 1000 caracteres'),
];

export const validacionFiltrosSolicitudes = [
  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('El límite debe estar entre 1 y 10000'),

  query('estado')
    .optional()
    .isIn(['pendiente', 'revisando', 'en_proceso', 'completado', 'rechazado', 'cancelado'])
    .withMessage('Estado no válido'),

  query('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'urgente'])
    .withMessage('Prioridad no válida'),

  query('ordenarPor')
    .optional()
    .isIn(['fechaEvento', 'fechaLimite', 'prioridad', 'createdAt'])
    .withMessage('Campo de ordenamiento no válido'),

  query('orden')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('El orden debe ser ASC o DESC'),
];