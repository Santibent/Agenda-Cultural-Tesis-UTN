


CREATE DATABASE IF NOT EXISTS agenda_cultural_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'agenda_user'@'localhost' IDENTIFIED BY 'agenda_password_2024';
GRANT ALL PRIVILEGES ON agenda_cultural_db.* TO 'agenda_user'@'localhost';
FLUSH PRIVILEGES;
SELECT 'Base de datos y usuario creados correctamente' AS Resultado;
SHOW DATABASES LIKE 'agenda_cultural_db';
SELECT User, Host FROM mysql.user WHERE User = 'agenda_user';
