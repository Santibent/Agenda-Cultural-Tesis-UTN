import { body, query } from 'express-validator';

export const validacionCrearFlyer = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede superar 1000 caracteres'),

  body('eventoRelacionadoId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debe proporcionar un ID de evento válido'),

  body('etiquetas')
    .optional()
    .custom((value) => {
      
      if (Array.isArray(value)) {
        return true;
      }
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return true;
          }
        } catch (e) {
          
        }
      }
      return true;
    })
    .withMessage('Las etiquetas deben ser un array o un JSON string'),

  body('orden')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El orden debe ser un número mayor o igual a 0'),

  body('visible')
    .optional()
    .isBoolean()
    .withMessage('El campo visible debe ser verdadero o falso'),

  body('destacado')
    .optional()
    .isBoolean()
    .withMessage('El campo destacado debe ser verdadero o falso'),
];

export const validacionActualizarFlyer = [
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede superar 1000 caracteres'),

  body('eventoRelacionadoId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debe proporcionar un ID de evento válido'),

  body('etiquetas')
    .optional()
    .custom((value) => {
      
      if (Array.isArray(value)) {
        return true;
      }
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return true;
          }
        } catch (e) {
          
        }
      }
      return true;
    })
    .withMessage('Las etiquetas deben ser un array o un JSON string'),

  body('orden')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El orden debe ser un número mayor o igual a 0'),

  body('visible')
    .optional()
    .isBoolean()
    .withMessage('El campo visible debe ser verdadero o falso'),

  body('destacado')
    .optional()
    .isBoolean()
    .withMessage('El campo destacado debe ser verdadero o falso'),
];

export const validacionFiltrosFlyers = [
  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('El límite debe estar entre 1 y 10000'),

  query('visible')
    .optional()
    .isBoolean()
    .withMessage('El filtro visible debe ser true o false'),

  query('destacado')
    .optional()
    .isBoolean()
    .withMessage('El filtro destacado debe ser true o false'),

  query('eventoRelacionadoId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de evento debe ser un número válido'),

  query('ordenarPor')
    .optional()
    .isIn(['orden', 'vistas', 'createdAt'])
    .withMessage('Campo de ordenamiento no válido'),

  query('orden')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('El orden debe ser ASC o DESC'),
];