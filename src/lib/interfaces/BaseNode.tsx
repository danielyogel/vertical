import { IComputedValue, IObservableValue } from 'mobx';
import { FC } from '../../utils';

export type BaseNodeNoView<V, S, O, P = {}> = {
  value: IComputedValue<V>;
  onChange: (value: V) => void;
  store: IComputedValue<S>;
  onStoreChange: (change: Partial<S>) => void;
  isLoading: IObservableValue<boolean>;
  progress: IObservableValue<number>;
  isVisible: IComputedValue<boolean>;
  isSelected: IComputedValue<boolean>;
  options: O;
  parentOptios: P;
};

export type BaseNode<V, S, O, P> = BaseNodeNoView<V, S, O, P> & {
  View: FC<any>;
};

export type RecordBaseNode<V, S, O, K extends string, P> = BaseNodeNoView<V, S, O, P> & {
  children: Record<K, BaseNode<any, S, any, O>>;
  View: FC<any>;
};

export type RecordBaseNodeNoView<V, S, O, K extends string, P> = BaseNodeNoView<V, S, O, P> & {
  children: Record<K, BaseNode<any, S, any, O>>;
};

export type ArrayBaseNode<V, S, O> = BaseNodeNoView<V, S, O, {}> & {
  currentIndex: IObservableValue<number>;
  children: ReadonlyArray<RecordBaseNode<any, S, any, any, O>>;
  View: FC<any>;
};

export type ArrayBaseNodeNoView<V, S, O> = BaseNodeNoView<V, S, O, any> & {
  currentIndex: IObservableValue<number>;
  children: ReadonlyArray<RecordBaseNode<any, S, any, any, any>>;
};

export type NodeFn<VM extends BaseNodeNoView<any, any, any, any>> = (arg: VM) => BaseNode<any, any, any, any>;

export type NodeObjectFn<VM extends BaseNodeNoView<any, any, any>> = (arg: VM) => RecordBaseNode<any, any, any, any, any>;
