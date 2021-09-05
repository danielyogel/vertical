import { IComputedValue, IObservableValue } from 'mobx';
import { O } from 'ts-toolbelt';
import { FC } from '../utils';

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
  currentIndex?: IObservableValue<number>;
};

//
//  Instances
//

export type ScalarNode<V, S> = BaseNode<V, S> & {
  index: string | number;
  onChange: (value: V) => void;
  children: null | IObservableValue<Array<O.Required<Partial<BaseNode<any, S>>, 'View'>>>; //NOTE: "ScalarNode" may be DynamicArray - so it may have children
};

export type RecordNode<V, S> = BaseNode<V, S> &
  ArrayProps & {
    index: string | number;
    onChange: (value: Partial<V>) => void;
    children: Record<string, O.Required<Partial<ScalarNode<any, S>>, 'View'>>;
  };

export type ArrayNode<V, S> = BaseNode<V, S> &
  ArrayProps & {
    index: string | number;
    onChange: (value: Partial<V>) => void;
    children: Array<O.Required<Partial<BaseNode<any, S>>, 'View'>>;
  };

export type DynamicArrayNode<V, S> = BaseNode<V[], S> & {
  index: string | number;
  selectedId: IObservableValue<string | null>;
  onChange: (value: V[]) => void;
  add: () => void;
  children: IObservableValue<Array<O.Required<Partial<BaseNode<any, S>>, 'View'>>>;
  childEdit: IComputedValue<null | O.Required<Partial<BaseNode<any, S>>, 'View'>>;
};

export type DynamicArrayChildNode<V, S> = BaseNode<V, S> & {
  index: string | number;
  selectedId: IObservableValue<string | null>;
  onChange: (value: Partial<V>) => void;
  remove: () => void;
  children: Record<string, O.Required<Partial<ScalarNode<any, S>>, 'View'>>;
};

export type Node<V, S> = ScalarNode<V, S> | RecordNode<V, S> | ArrayNode<V, S> | DynamicArrayNode<V, S>;

//
// props
//

export type ArrayProps = {
  currentIndex: IObservableValue<number>;
  isFirst: IComputedValue<boolean>;
  isLast: IComputedValue<boolean>;
  back: () => void;
  next: () => void;
};
