import { Sequelize } from 'sequelize';
/**
 * Configuración de la conexión a la base de datos MySQL
 */
declare const sequelize: Sequelize;
/**
 * Función para verificar la conexión a la base de datos
 */
export declare const conectarBaseDatos: () => Promise<void>;
export default sequelize;
//# sourceMappingURL=base-datos.config.d.ts.map