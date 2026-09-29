import { IObserver } from './IObserver';


export interface ISubject<T = unknown> {
  attach(observer: IObserver<T>): void;

  detach(observer: IObserver<T>): void;

  notify(event: T): Promise<void>;
}
