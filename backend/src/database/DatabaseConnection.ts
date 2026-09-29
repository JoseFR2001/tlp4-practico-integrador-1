import mongoose from 'mongoose';



 export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  
  public async connect(uri: string): Promise<typeof mongoose> {
    if (this.isConnected) {
      console.log('[Singleton: DatabaseConnection] Ya existe una conexión activa a la base de datos.');
      return mongoose;
    }

    try {
      const connection = await mongoose.connect(uri);
      this.isConnected = true;
      console.log('[Singleton: DatabaseConnection] Conectado exitosamente a MongoDB.');
      return connection;
    } catch (error) {
      console.error('[Singleton: DatabaseConnection] Error al conectar a MongoDB:', error);
      throw error;
    }
  }

 
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('[Singleton: DatabaseConnection] Desconectado de MongoDB.');
    } catch (error) {
      console.error('[Singleton: DatabaseConnection] Error al desconectar de MongoDB:', error);
      throw error;
    }
  }


  public getStatus(): boolean {
    return this.isConnected;
  }
}
