
export class ErrorPersonalizado extends Error {
  public codigoEstado: number;
  public codigo: string;
  public detalles?: any;

  constructor(mensaje: string, codigoEstado: number, codigo: string, detalles?: any) {
    super(mensaje);
    this.codigoEstado = codigoEstado;
    this.codigo = codigo;
    this.detalles = detalles;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorValidacion extends ErrorPersonalizado {
  constructor(mensaje: string = 'Error de validación', detalles?: any) {
    super(mensaje, 422, 'VALIDATION_ERROR', detalles);
  }
}

export class ErrorAutenticacion extends ErrorPersonalizado {
  constructor(mensaje: string = 'No autorizado') {
    super(mensaje, 401, 'UNAUTHORIZED');
  }
}

export class ErrorAutorizacion extends ErrorPersonalizado {
  constructor(mensaje: string = 'Acceso prohibido') {
    super(mensaje, 403, 'FORBIDDEN');
  }
}

export class ErrorNoEncontrado extends ErrorPersonalizado {
  constructor(mensaje: string = 'Recurso no encontrado') {
    super(mensaje, 404, 'NOT_FOUND');
  }
}

export class ErrorConflicto extends ErrorPersonalizado {
  constructor(mensaje: string = 'Conflicto con el estado actual') {
    super(mensaje, 409, 'CONFLICT');
  }
}

export class ErrorServidor extends ErrorPersonalizado {
  constructor(mensaje: string = 'Error interno del servidor', detalles?: any) {
    super(mensaje, 500, 'INTERNAL_SERVER_ERROR', detalles);
  }
}