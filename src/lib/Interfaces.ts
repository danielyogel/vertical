import { IComputedValue, IObservableValue } from 'mobx';
import { FC } from '../utils';

export type BaseNode<V, S, O> = {
  value: IComputedValue<V>;
  onChange: (value: V) => void;
  store: IComputedValue<S>;
  onStoreChange: (change: Partial<S>) => void;
  isLoading: IObservableValue<boolean>;
  progress: IObservableValue<number>;
  isVisible: IComputedValue<boolean>;
  isSelected: IComputedValue<boolean>;
  options: O;
  View: FC<any>;
};

type InferScalarValue<F> = F extends (args: infer V) => any ? (V extends { value: IComputedValue<infer Z> } ? Z : never) : never;

export type InferObjectValue<T extends Record<string, any>> = {
  [K in keyof T]: InferScalarValue<T[K]>;
};

export type InferArrayValue<T extends ReadonlyArray<any>> = {
  [K in keyof T]: InferScalarValue<T[K]>;
};
