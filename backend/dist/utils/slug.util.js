"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarSlug = void 0;
/**
 * Generar slug a partir de un texto
 */
const generarSlug = (texto) => {
    return texto
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno solo
        .replace(/^-+/, '') // Eliminar guiones al inicio
        .replace(/-+$/, ''); // Eliminar guiones al final
};
exports.generarSlug = generarSlug;
//# sourceMappingURL=slug.util.js.map