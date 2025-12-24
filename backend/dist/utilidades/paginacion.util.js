"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginacionUtil = void 0;
/**
 * Clase para manejar paginación
 */
class PaginacionUtil {
    /**
     * Valores por defecto
     */
    static PAGINA_DEFAULT = 1;
    static LIMITE_DEFAULT = 10;
    static LIMITE_MAXIMO = 100;
    /**
     * Obtener offset y limit para consultas
     */
    static obtenerOffsetLimit(opciones) {
        const pagina = Math.max(opciones.pagina || this.PAGINA_DEFAULT, 1);
        const limite = Math.min(Math.max(opciones.limite || this.LIMITE_DEFAULT, 1), this.LIMITE_MAXIMO);
        const offset = (pagina - 1) * limite;
        return { offset, limit: limite };
    }
    /**
     * Formatear resultado con metadata de paginación
     */
    static formatearResultado(datos, total, opciones) {
        const pagina = opciones.pagina || this.PAGINA_DEFAULT;
        const limite = Math.min(opciones.limite || this.LIMITE_DEFAULT, this.LIMITE_MAXIMO);
        const totalPaginas = Math.ceil(total / limite);
        return {
            datos,
            paginacion: {
                paginaActual: pagina,
                limitePorPagina: limite,
                totalRegistros: total,
                totalPaginas,
                tienePaginaAnterior: pagina > 1,
                tienePaginaSiguiente: pagina < totalPaginas,
            },
        };
    }
    /**
     * Validar opciones de paginación
     */
    static validarOpciones(opciones) {
        const errores = [];
        if (opciones.pagina && opciones.pagina < 1) {
            errores.push('La página debe ser mayor o igual a 1');
        }
        if (opciones.limite && opciones.limite < 1) {
            errores.push('El límite debe ser mayor o igual a 1');
        }
        if (opciones.limite && opciones.limite > this.LIMITE_MAXIMO) {
            errores.push(`El límite no puede ser mayor a ${this.LIMITE_MAXIMO}`);
        }
        if (opciones.orden && !['ASC', 'DESC'].includes(opciones.orden)) {
            errores.push('El orden debe ser ASC o DESC');
        }
        return errores;
    }
}
exports.PaginacionUtil = PaginacionUtil;
//# sourceMappingURL=paginacion.util.js.map