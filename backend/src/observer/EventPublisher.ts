import { ISubject } from './ISubject';
import { IObserver } from './IObserver';
import { LibroStatusChangedEvent } from './events/LibroStatusChangedEvent';


export class EventPublisher implements ISubject<LibroStatusChangedEvent> {
  // Lista de observadores registrados
  private observers: IObserver<LibroStatusChangedEvent>[] = [];


   
  public attach(observer: IObserver<LibroStatusChangedEvent>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log('[Observer: EventPublisher] El observador ya se encuentra registrado.');
      return;
    }

    this.observers.push(observer);
    console.log('[Observer: EventPublisher] Observador agregado con éxito.');
  }


  public detach(observer: IObserver<LibroStatusChangedEvent>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log('[Observer: EventPublisher] El observador no existe en la lista.');
      return;
    }

    this.observers.splice(observerIndex, 1);
    console.log('[Observer: EventPublisher] Observador removido con éxito.');
  }


  public async notify(event: LibroStatusChangedEvent): Promise<void> {
    console.log(`[Observer: EventPublisher] Notificando cambio de estado para el libro "${event.libroTitulo}" (${this.observers.length} observadores)...`);
    
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (error) {
        console.error('[Observer: EventPublisher] Error al ejecutar update() en observador:', error);
      }
    }
  }

 
  public getObserversCount(): number {
    return this.observers.length;
  }
}
