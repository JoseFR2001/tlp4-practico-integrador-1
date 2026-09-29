import mongoose from 'mongoose';


 //Características clave:
 //1. Constructor privado (evita que se use `new DatabaseConnection()`).
 //2. Atributo estático privado `instance` que guarda la única instancia.
 //3. Método estático público `getInstance()` que devuelve dicha instancia.

 export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private isConnected = false;

  //Constructor privado: impide instanciación externa directa con "new"
  private constructor() {}

  //Método de acceso global a la única instancia de DatabaseConnection.
  //Si aún no fue creada, la crea (Lazy Initialization). Si ya existe, devuelve la existente.
  
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
