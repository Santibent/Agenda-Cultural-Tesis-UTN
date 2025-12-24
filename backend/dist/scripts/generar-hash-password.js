"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encriptacion_servicio_1 = require("../servicios/encriptacion.servicio");
/**
 * Script para generar hash de contraseña
 * Uso: ts-node src/scripts/generar-hash-password.ts "tu_password"
 */
async function generarHash() {
    const password = process.argv[2];
    if (!password) {
        console.error('❌ Debes proporcionar una contraseña');
        console.log('Uso: ts-node src/scripts/generar-hash-password.ts "tu_password"');
        process.exit(1);
    }
    try {
        const hash = await encriptacion_servicio_1.EncriptacionServicio.hashPassword(password);
        console.log('\n✅ Hash generado exitosamente:');
        console.log(`\nPassword: ${password}`);
        console.log(`Hash: ${hash}\n`);
        console.log('Copia este hash y úsalo en el script de inicialización de la BD\n');
    }
    catch (error) {
        console.error('❌ Error al generar hash:', error);
        process.exit(1);
    }
}
generarHash();
//# sourceMappingURL=generar-hash-password.js.map