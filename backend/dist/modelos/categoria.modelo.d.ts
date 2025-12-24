import { Model, Optional } from 'sequelize';
/**
 * Interfaz de atributos de Categoría
 */
interface CategoriaAtributos {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    color: string;
    icono: string | null;
    activo: boolean;
    orden: number;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Atributos opcionales al crear una categoría
 */
interface CategoriaCreacionAtributos extends Optional<CategoriaAtributos, 'id' | 'descripcion' | 'icono' | 'activo' | 'orden'> {
}
/**
 * Modelo de Categoría
 */
declare class Categoria extends Model<CategoriaAtributos, CategoriaCreacionAtributos> implements CategoriaAtributos {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    color: string;
    icono: string | null;
    activo: boolean;
    orden: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Categoria;
//# sourceMappingURL=categoria.modelo.d.ts.map