import { IComputedValue, IObservableValue } from 'mobx';
import { O } from 'ts-toolbelt';
import { FC } from '../utils';

export type BaseNode<V, S> = {
  value: IComputedValue<V>;
  onChange: (value: V) => void;
  store: IComputedValue<S>;
  onStoreChange: (change: Partial<S>) => void;
  label: IComputedValue<string>;
  isLoading: IComputedValue<boolean>;
  setLoading: (isLoading: boolean) => void;
  progress: IObservableValue<number>;
  isVisible: IComputedValue<boolean>;
  isSelected: IComputedValue<boolean>;
  isDisabled: IComputedValue<boolean>;
  errors: IComputedValue<Array<{ message: string }>>;
  View: FC<any>;
  autoFocus: boolean;
  children: null | Array<O.Required<Partial<BaseNode<any, S>>, 'View'>> | Record<string, Partial<O.Required<Partial<BaseNode<any, S>>, 'View'>>>;
};

type InferScalarValue<F> = F extends (args: infer V) => any ? (V extends { value: IComputedValue<infer Z> } ? Z : never) : never;

export type InferObjectValue<T extends Record<string, any>> = {
  [K in keyof T]: InferScalarValue<T[K]>;
};

export type InferArrayValue<T extends ReadonlyArray<any>> = {
  [K in keyof T]: InferScalarValue<T[K]>;
};
