import dotenv from 'dotenv';
dotenv.config();

export const env = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/biblioteca',
  PORT: Number(process.env.API_PORT || process.env.PORT || 3000),
  JWT_SECRET: process.env.JWT_SECRET || 'clave_secreta_jwt_biblioteca_tlp4',
};

