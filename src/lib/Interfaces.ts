import { IComputedValue, IObservableValue } from 'mobx';
import { O } from 'ts-toolbelt';
import { FC } from '../utils';

//
//  Nodes
//
type BaseNode<V, S> = {
  id: string;
  value: IComputedValue<V>;
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
  children: null | Array<O.Required<Partial<BaseNode<any, S>>, 'View'>> | Record<string, O.Required<Partial<BaseNode<any, S>>, 'View'>>;
};

export type ScalarNode<V, S> = BaseNode<V, S> & {
  onChange: (value: V) => void;
  children: null;
};

export type RecordNode<V, S> = BaseNode<V, S> & {
  onChange: (value: Partial<V>) => void;
  children: Record<string, O.Required<Partial<BaseNode<any, S>>, 'View'>>;
};

export type ArrayNode<V, S> = BaseNode<V, S> & {
  onChange: (value: Partial<V>) => void;
  children: Array<O.Required<Partial<BaseNode<any, S>>, 'View'>>;
};

export type Node<V, S> = ScalarNode<V, S> | RecordNode<V, S> | ArrayNode<V, S>;
