
export interface IObserver<T = unknown> {

  update(event: T): Promise<void>;
}
