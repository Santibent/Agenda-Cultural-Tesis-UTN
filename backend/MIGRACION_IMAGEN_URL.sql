-- Migración para agregar campo imagen_url a tabla eventos
-- Ejecutar este SQL en la base de datos antes de iniciar el servidor

ALTER TABLE eventos ADD COLUMN imagen_url TEXT NULL AFTER imagen_banner;

-- Actualizar eventos existentes que tengan imagen_principal
-- para crear un objeto JSON simple
UPDATE eventos
SET imagen_url = JSON_OBJECT('original', imagen_principal, 'mediano', imagen_principal)
WHERE imagen_principal IS NOT NULL;
