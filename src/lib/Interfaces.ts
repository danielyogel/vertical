import { IComputedValue, IObservableValue } from 'mobx';
import { O } from 'ts-toolbelt';
import { FC } from '../utils';

type BaseNode<V, S, R> = {
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
  context: R;
};

//
//  Instances
//

export type ScalarNode<V, S, R> = BaseNode<V, S, R> & {
  index: string | number;
  onChange: (value: V) => void;
  children: null | IObservableValue<Array<O.Required<Partial<BaseNode<any, S, R>>, 'View' | 'id'>>>; //NOTE: "ScalarNode" may be DynamicArray - so it may have children
};

export type RecordNode<V, S, R> = BaseNode<V, S, R> &
  ArrayProps & {
    index: string | number;
    onChange: (value: Partial<V>) => void;
    children: Record<string, O.Required<Partial<ScalarNode<any, S, R>>, 'View' | 'id'>>;
  };

export type ArrayNode<V, S, R> = BaseNode<V, S, R> &
  ArrayProps & {
    index: string | number;
    onChange: (value: Partial<V>) => void;
    children: Array<O.Required<Partial<BaseNode<any, S, R>>, 'View' | 'id'>>;
  };

export type DynamicArrayNode<V, S, R> = BaseNode<V[], S, R> & {
  index: string | number;
  selectedId: { get: () => string | null; set: (id: string | null) => void };
  onChange: (value: V[]) => void;
  add: () => void;
  removeById: (id: string) => void;
  children: IObservableValue<Array<O.Required<Partial<BaseNode<any, S, R>>, 'View' | 'id'>>>;
  selectedChild: IComputedValue<null | O.Required<Partial<BaseNode<any, S, R>>, 'View' | 'id'>>;
  allowChildEdit: boolean;
};

export type DynamicArrayChildNode<V, S, R> = BaseNode<V, S, R> & {
  index: string | number;
  setSelectedId: (id: string | null) => void;
  onChange: (value: Partial<V>) => void;
  remove: () => void;
  children: Record<string, O.Required<Partial<ScalarNode<any, S, R>>, 'View' | 'id'>>;
};

export type Node<V, S, R> = ScalarNode<V, S, R> | RecordNode<V, S, R> | ArrayNode<V, S, R> | DynamicArrayNode<V, S, R>;

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
