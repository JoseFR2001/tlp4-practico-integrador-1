import bcrypt from 'bcrypt';
import { UserModel } from '../modules/users/User';
import { LibroModel } from '../modules/libros/Libro';

export const seedInitialData = async (): Promise<void> => {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Ejecutando seed de usuarios de prueba...');
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash('123456', salt);

      await UserModel.create([
        {
          nombre: 'Administrador Principal',
          email: 'admin@tp.com',
          passwordHash: hashPassword,
          rol: 'admin',
        },
        {
          nombre: 'Operador de Biblioteca',
          email: 'operador@tp.com',
          passwordHash: hashPassword,
          rol: 'operador',
        },
        {
          nombre: 'Usuario Lector',
          email: 'usuario@tp.com',
          passwordHash: hashPassword,
          rol: 'usuario',
        },
      ]);
      console.log('✅ Usuarios iniciales creados (admin@tp.com, operador@tp.com, usuario@tp.com - pass: 123456)');
    }

    const libroCount = await LibroModel.countDocuments();
    if (libroCount === 0) {
      console.log('🌱 Ejecutando seed de libros de prueba...');
      await LibroModel.create([
        {
          titulo: 'Cien años de soledad',
          autor: 'Gabriel García Márquez',
          descripcion: 'Historia de la familia Buendía en el pueblo ficticio de Macondo.',
          estado: 'DISPONIBLE',
        },
        {
          titulo: 'El señor de los anillos',
          autor: 'J.R.R. Tolkien',
          descripcion: 'Novela de fantasía épica sobre la misión para destruir el Anillo Único.',
          estado: 'DISPONIBLE',
        },
        {
          titulo: 'Don Quijote de la Mancha',
          autor: 'Miguel de Cervantes',
          descripcion: 'Clásico de las aventuras de un hidalgo caballero y su escudero Sancho Panza.',
          estado: 'DISPONIBLE',
        },
      ]);
      console.log('✅ Libros de prueba iniciales creados.');
    }
  } catch (error) {
    console.error('Error durante el seed inicial:', error);
  }
};

