import { body } from 'express-validator';

export const validacionRegistro = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),

  body('confirmarPassword')
    .notEmpty()
    .withMessage('Debe confirmar la contraseña')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden'),
];

export const validacionLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

export const validacionRecuperacionPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
];

export const validacionRestablecerPassword = [
  body('token')
    .notEmpty()
    .withMessage('El token es obligatorio'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),

  body('confirmarPassword')
    .notEmpty()
    .withMessage('Debe confirmar la contraseña')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden'),
];

export const validacionCambiarPassword = [
  body('passwordActual')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),

  body('passwordNueva')
    .notEmpty()
    .withMessage('La contraseña nueva es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial')
    .custom((value, { req }) => value !== req.body.passwordActual)
    .withMessage('La nueva contraseña debe ser diferente a la actual'),

  body('confirmarPasswordNueva')
    .notEmpty()
    .withMessage('Debe confirmar la nueva contraseña')
    .custom((value, { req }) => value === req.body.passwordNueva)
    .withMessage('Las contraseñas no coinciden'),
]