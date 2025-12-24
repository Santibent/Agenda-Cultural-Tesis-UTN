


SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;


USE agenda_cultural_db;


CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'usuario') DEFAULT 'usuario',
  email_verificado BOOLEAN DEFAULT FALSE,
  token_verificacion VARCHAR(255) NULL,
  token_recuperacion VARCHAR(255) NULL,
  token_expiracion DATETIME NULL,
  avatar_url VARCHAR(500) NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_token_verificacion (token_verificacion),
  INDEX idx_token_recuperacion (token_recuperacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#FF0000',
  icono VARCHAR(50) NULL,
  activo BOOLEAN DEFAULT TRUE,
  orden INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS eventos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  descripcion_corta VARCHAR(300) NULL,
  categoria_id INT NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NULL,
  hora_inicio TIME NULL,
  hora_fin TIME NULL,
  ubicacion VARCHAR(200) NOT NULL,
  direccion VARCHAR(255) NULL,
  ciudad VARCHAR(100) DEFAULT 'Venado Tuerto',
  provincia VARCHAR(100) DEFAULT 'Santa Fe',
  pais VARCHAR(100) DEFAULT 'Argentina',
  latitud DECIMAL(10, 8) NULL,
  longitud DECIMAL(11, 8) NULL,
  imagen_principal VARCHAR(500) NULL,
  imagen_banner VARCHAR(500) NULL,
  precio DECIMAL(10,2) DEFAULT 0,
  moneda VARCHAR(3) DEFAULT 'ARS',
  capacidad INT NULL,
  link_externo VARCHAR(500) NULL,
  link_tickets VARCHAR(500) NULL,
  organizador VARCHAR(200) NULL,
  contacto_email VARCHAR(150) NULL,
  contacto_telefono VARCHAR(20) NULL,
  destacado BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  vistas INT DEFAULT 0,
  usuario_creador_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  FOREIGN KEY (usuario_creador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  INDEX idx_slug (slug),
  INDEX idx_categoria (categoria_id),
  INDEX idx_fecha_inicio (fecha_inicio),
  INDEX idx_destacado (destacado),
  INDEX idx_activo (activo),
  INDEX idx_ciudad (ciudad),
  FULLTEXT idx_busqueda (titulo, descripcion, ubicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS flyers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NULL,
  imagen_url VARCHAR(500) NOT NULL,
  imagen_thumbnail VARCHAR(500) NULL,
  evento_relacionado_id INT NULL,
  etiquetas JSON NULL,
  orden INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE,
  vistas INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (evento_relacionado_id) REFERENCES eventos(id) ON DELETE SET NULL,
  
  INDEX idx_visible (visible),
  INDEX idx_destacado (destacado),
  INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS solicitudes_flyer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nombre_evento VARCHAR(200) NOT NULL,
  tipo_evento VARCHAR(100) NULL,
  fecha_evento DATE NULL,
  descripcion TEXT NOT NULL,
  referencias TEXT NULL,
  colores_preferidos VARCHAR(200) NULL,
  estilo_preferido VARCHAR(200) NULL,
  informacion_incluir TEXT NULL,
  presupuesto DECIMAL(10,2) NULL,
  contacto_email VARCHAR(150) NOT NULL,
  contacto_telefono VARCHAR(20) NULL,
  contacto_whatsapp VARCHAR(20) NULL,
  fecha_limite DATE NULL,
  estado ENUM('pendiente', 'revisando', 'en_proceso', 'completado', 'rechazado', 'cancelado') DEFAULT 'pendiente',
  prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
  notas_admin TEXT NULL,
  archivo_resultado VARCHAR(500) NULL,
  fecha_completado DATETIME NULL,
  calificacion INT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario_usuario TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  INDEX idx_usuario (usuario_id),
  INDEX idx_estado (estado),
  INDEX idx_prioridad (prioridad),
  INDEX idx_fecha_evento (fecha_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS imagenes_evento (
  id INT PRIMARY KEY AUTO_INCREMENT,
  evento_id INT NOT NULL,
  imagen_url VARCHAR(500) NOT NULL,
  titulo VARCHAR(200) NULL,
  descripcion TEXT NULL,
  orden INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
  
  INDEX idx_evento (evento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO categorias (nombre, slug, descripcion, color, icono, orden) VALUES
('Música', 'musica', 'Conciertos, recitales y festivales musicales', '#E91E63', 'music', 1),
('Arte', 'arte', 'Exposiciones, muestras y galerías de arte', '#9C27B0', 'palette', 2),
('Teatro', 'teatro', 'Obras teatrales y performances', '#673AB7', 'theater', 3),
('Cine', 'cine', 'Funciones de cine y ciclos de películas', '#3F51B5', 'movie', 4),
('Danza', 'danza', 'Espectáculos de danza y ballet', '#2196F3', 'dance', 5),
('Literatura', 'literatura', 'Presentaciones de libros y encuentros literarios', '#00BCD4', 'book', 6),
('Gastronomía', 'gastronomia', 'Eventos gastronómicos y ferias de comida', '#FF9800', 'restaurant', 7),
('Deportes', 'deportes', 'Eventos deportivos y competencias', '#4CAF50', 'sports', 8),
('Educación', 'educacion', 'Talleres, charlas y capacitaciones', '#FFC107', 'school', 9),
('Festivales', 'festivales', 'Festivales y eventos multidisciplinarios', '#F44336', 'celebration', 10);


INSERT INTO usuarios (nombre, email, password, rol, email_verificado, activo) VALUES
('Administrador', 'admin@agendacultural.com', '$2b$10$gOSg///ULn6aWDd21J45de0jC9p.jz9LO6eKWI1Sg54.zQ5Ebzgx2', 'admin', TRUE, TRUE);


ALTER TABLE eventos ADD INDEX idx_fecha_categoria (fecha_inicio, categoria_id);
ALTER TABLE eventos ADD INDEX idx_destacado_activo (destacado, activo);

