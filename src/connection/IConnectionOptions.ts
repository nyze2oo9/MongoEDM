export interface IConnectionOptions {
  readonly uri: string;
  readonly entities?: ((Function|string))[];
}