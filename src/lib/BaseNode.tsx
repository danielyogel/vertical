import { IComputedValue, IObservableValue } from 'mobx';

export type BaseNode<V, S, O> = O & {
  value: IComputedValue<V>;
  onChange: (value: V) => void;
  store: IComputedValue<S>;
  onStoreChange: (change: Partial<S>) => void;
  isLoading: IObservableValue<boolean>;
  progress: IObservableValue<number>;
  isVisible: IComputedValue<boolean>;
  isSelected: IComputedValue<boolean>;
};

export type RecordBaseNode<V, S, O, K extends string> = O & {
  value: IComputedValue<V>;
  onChange: (value: V) => void;
  store: IComputedValue<S>;
  onStoreChange: (change: Partial<S>) => void;
  isLoading: IObservableValue<boolean>;
  progress: IObservableValue<number>;
  isVisible: IComputedValue<boolean>;
  isSelected: IComputedValue<boolean>;
  children?: Record<K, BaseNode<any, S, any>>;
};

export type NodeFn = (arg: {
  value: IComputedValue<any>;
  onChange: (value: any) => void;
  store: IComputedValue<any>;
  onStoreChange: (change: Partial<any>) => void;
}) => BaseNode<any, any, any>;
