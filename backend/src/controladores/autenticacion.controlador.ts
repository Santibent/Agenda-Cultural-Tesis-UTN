import { Request, Response } from 'express';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { ErrorAutenticacion, ErrorConflicto, ErrorNoEncontrado, ErrorValidacion } from '../utilidades/errores.util';
import Usuario from '../modelos/usuario.modelo';
import { EncriptacionServicio } from '../servicios/encriptacion.servicio';
import { TokenServicio } from '../servicios/token.servicio';
import EmailServicio from '../servicios/email.servicio';
import { RolUsuario } from '../tipos/enums';

export class AutenticacionControlador {
  
  static async registro(req: Request, res: Response) {
    try {
      const { nombre, email, password } = req.body;

      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        throw new ErrorConflicto('El email ya está registrado');
      }

      const passwordHash = await EncriptacionServicio.hashPassword(password);

      const tokenVerificacion = EncriptacionServicio.generarToken();

      const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        password: passwordHash,
        rol: RolUsuario.USUARIO,
        emailVerificado: false,
        tokenVerificacion,
        activo: true,
      });

      try {
        await EmailServicio.enviarEmailVerificacion(email, nombre, tokenVerificacion);
      } catch (error) {
        console.error('Error al enviar email de verificación:', error);
        
      }

      return RespuestaUtil.creado(
        res, 
        'Usuario registrado exitosamente. Por favor verifica tu email antes de iniciar sesión.', 
        {
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          emailVerificado: false,
          mensaje: 'Hemos enviado un correo de verificación a tu email.'
        }
      );
    } catch (error: any) {
      if (error instanceof ErrorConflicto) {
        return RespuestaUtil.conflicto(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al registrar usuario', error);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      console.log('🔍 Debug Login - Usuario encontrado:', {
        email,
        usuarioEncontrado: !!usuario,
        id: usuario?.id,
        activo: usuario?.activo,
        emailVerificado: usuario?.emailVerificado,
      });

      if (!usuario) {
        throw new ErrorAutenticacion('Credenciales inválidas');
      }

      if (!usuario.activo) {
        console.log('❌ Usuario inactivo detectado');
        throw new ErrorAutenticacion('Usuario inactivo. Contacta al administrador.');
      }

      if (!usuario.emailVerificado) {
        console.log('⚠️ Email no verificado:', email);
        return RespuestaUtil.error(
          res,
          'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.',
          403,
          undefined,
          {
            emailVerificado: false,
            email: usuario.email
          }
        );
      }

      console.log('✅ Usuario activo y verificado');

      const passwordValida = await EncriptacionServicio.compararPassword(
        password,
        usuario.password
      );

      console.log('🔑 Verificación de password:', passwordValida);

      if (!passwordValida) {
        throw new ErrorAutenticacion('Credenciales inválidas');
      }

      const payload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
      };

      const tokenAcceso = TokenServicio.generarTokenAcceso(payload);
      const tokenRefresco = TokenServicio.generarTokenRefresco(payload);

      console.log('✅ Login exitoso para:', email);

      return RespuestaUtil.exito(res, 'Login exitoso', {
        usuario: usuario.toJSON(),
        tokens: {
          acceso: tokenAcceso,
          refresco: tokenRefresco,
        },
        emailVerificado: usuario.emailVerificado,
      });
    } catch (error: any) {
      console.error('❌ Error en login:', error.message);
      if (error instanceof ErrorAutenticacion) {
        return RespuestaUtil.noAutorizado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al iniciar sesión', error);
    }
  }

  static async obtenerPerfil(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutenticacion('Usuario no autenticado');
      }

      const usuario = await Usuario.findByPk(req.usuario.id);

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      return RespuestaUtil.exito(res, 'Perfil obtenido exitosamente', usuario.toJSON());
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener perfil', error);
    }
  }

  static async actualizarPerfil(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutenticacion('Usuario no autenticado');
      }

      const { nombre } = req.body;

      const usuario = await Usuario.findByPk(req.usuario.id);

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      if (nombre) usuario.nombre = nombre;

      await usuario.save();

      return RespuestaUtil.exito(res, 'Perfil actualizado exitosamente', usuario.toJSON());
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar perfil', error);
    }
  }

  static async verificarEmail(req: Request, res: Response) {
    try {
      
      const token = req.query.token as string || req.body.token;

      if (!token) {
        throw new ErrorValidacion('Token no proporcionado');
      }

      const usuario = await Usuario.findOne({ where: { tokenVerificacion: token } });

      if (!usuario) {
        throw new ErrorNoEncontrado('Token inválido o expirado');
      }

      if (usuario.emailVerificado) {
        return RespuestaUtil.exito(res, 'Email ya verificado anteriormente');
      }

      usuario.emailVerificado = true;
      usuario.tokenVerificacion = null;
      await usuario.save();

      try {
        await EmailServicio.enviarEmailBienvenida(usuario.email, usuario.nombre);
      } catch (error) {
        console.error('Error al enviar email de bienvenida:', error);
      }

      const payload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
      };

      const tokenAcceso = TokenServicio.generarTokenAcceso(payload);
      const tokenRefresco = TokenServicio.generarTokenRefresco(payload);

      return RespuestaUtil.exito(res, 'Email verificado exitosamente. Ya puedes usar la aplicación.', {
        emailVerificado: true,
        tokens: {
          acceso: tokenAcceso,
          refresco: tokenRefresco,
        },
        usuario: usuario.toJSON()
      });
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado || error instanceof ErrorValidacion) {
        return RespuestaUtil.error(res, error.message, 400);
      }
      return RespuestaUtil.errorServidor(res, 'Error al verificar email', error);
    }
  }

  static async reenviarVerificacion(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        
        return RespuestaUtil.exito(
          res,
          'Si el email existe, recibirás un correo de verificación'
        );
      }

      if (usuario.emailVerificado) {
        return RespuestaUtil.exito(res, 'El email ya está verificado');
      }

      const tokenVerificacion = EncriptacionServicio.generarToken();
      usuario.tokenVerificacion = tokenVerificacion;
      await usuario.save();

      await EmailServicio.enviarEmailVerificacion(
        usuario.email,
        usuario.nombre,
        tokenVerificacion
      );

      return RespuestaUtil.exito(res, 'Email de verificación enviado');
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al reenviar verificación', error);
    }
  }

  static async recuperarPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        
        return RespuestaUtil.exito(
          res,
          'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
        );
      }

      const tokenRecuperacion = EncriptacionServicio.generarToken();
      const tokenExpiracion = new Date();
      tokenExpiracion.setHours(tokenExpiracion.getHours() + 1);

      usuario.tokenRecuperacion = tokenRecuperacion;
      usuario.tokenExpiracion = tokenExpiracion;
      await usuario.save();

      await EmailServicio.enviarEmailRecuperacion(
        usuario.email,
        usuario.nombre,
        tokenRecuperacion
      );

      return RespuestaUtil.exito(
        res,
        'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
      );
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al solicitar recuperación', error);
    }
  }

  static async restablecerPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      const usuario = await Usuario.findOne({ where: { tokenRecuperacion: token } });

      if (!usuario) {
        throw new ErrorNoEncontrado('Token inválido o expirado');
      }

      if (usuario.tokenExpiracion && new Date() > usuario.tokenExpiracion) {
        throw new ErrorValidacion('El token ha expirado');
      }

      const passwordHash = await EncriptacionServicio.hashPassword(password);

      usuario.password = passwordHash;
      usuario.tokenRecuperacion = null;
      usuario.tokenExpiracion = null;
      await usuario.save();

      return RespuestaUtil.exito(res, 'Contraseña restablecida exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado || error instanceof ErrorValidacion) {
        return RespuestaUtil.error(res, error.message, 400);
      }
      return RespuestaUtil.errorServidor(res, 'Error al restablecer contraseña', error);
    }
  }

  static async cambiarPassword(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutenticacion('Usuario no autenticado');
      }

      const { passwordActual, passwordNueva } = req.body;

      const usuario = await Usuario.findByPk(req.usuario.id);

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      const passwordValida = await EncriptacionServicio.compararPassword(
        passwordActual,
        usuario.password
      );

      if (!passwordValida) {
        throw new ErrorAutenticacion('La contraseña actual es incorrecta');
      }

      const passwordHash = await EncriptacionServicio.hashPassword(passwordNueva);

      usuario.password = passwordHash;
      await usuario.save();

      return RespuestaUtil.exito(res, 'Contraseña cambiada exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorAutenticacion) {
        return RespuestaUtil.noAutorizado(res, error.message);
      }
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al cambiar contraseña', error);
    }
  }

  static async refrescarToken(req: Request, res: Response) {
    try {
      const { tokenRefresco } = req.body;

      if (!tokenRefresco) {
        throw new ErrorValidacion('Token de refresco no proporcionado');
      }

      const payload = TokenServicio.verificarToken(tokenRefresco);

      const usuario = await Usuario.findByPk(payload.id);

      if (!usuario || !usuario.activo) {
        throw new ErrorAutenticacion('Usuario no válido');
      }

      const nuevoPayload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
      };

      const nuevoTokenAcceso = TokenServicio.generarTokenAcceso(nuevoPayload);

      return RespuestaUtil.exito(res, 'Token refrescado exitosamente', {
        acceso: nuevoTokenAcceso,
      });
    } catch (error: any) {
      if (error instanceof ErrorValidacion || error instanceof ErrorAutenticacion) {
        return RespuestaUtil.noAutorizado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al refrescar token', error);
    }
  }
}