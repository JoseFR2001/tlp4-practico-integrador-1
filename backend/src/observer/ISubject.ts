import { IObserver } from './IObserver';

/**
 * Patrón de Diseño: OBSERVER
 * Interfaz: ISubject
 * 
 * Propósito:
 * Define el contrato para el Sujeto (Observable) que mantiene una colección
 * de observadores suscritos y les notifica sobre los eventos que ocurren.
 */
export interface ISubject<T = unknown> {
  /**
   * Agrega un nuevo observador a la lista de suscritos.
   * @param observer El observador que desea escuchar eventos.
   */
  attach(observer: IObserver<T>): void;

  /**
   * Remueve un observador de la lista de suscritos.
   * @param observer El observador que desea dejar de recibir eventos.
   */
  detach(observer: IObserver<T>): void;

  /**
   * Notifica a todos los observadores registrados ejecutando su método update().
   * @param event Datos del evento a comunicar.
   */
  notify(event: T): Promise<void>;
}
