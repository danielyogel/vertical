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
  children:
    | null
    | IObservableValue<Array<O.Required<Partial<BaseNode<any, S>>, 'View' | 'id'>>>
    | Record<string, O.Required<Partial<ScalarNode<any, S>>, 'View' | 'id'>>; //NOTE: "ScalarNode" may be DynamicArray | ObjectNode - so it may have children
};

export type ObjectNode<V, S> = BaseNode<V, S> & {
  index: string | number;
  onChange: (value: V) => void;
  children: Record<string, O.Required<Partial<ScalarNode<any, S>>, 'View' | 'id'>>;
};

export type ArrayNode<V, S> = BaseNode<V, S> &
  ArrayProps & {
    index: string | number;
    onChange: (value: Partial<V>) => void;
    children: Array<O.Required<Partial<BaseNode<any, S>>, 'View' | 'id'>>;
  };

export type ArrayChildNode<V, S> = BaseNode<V, S> &
  ArrayProps & {
    index: string | number;
    onChange: (value: Partial<V>) => void;
    children: Record<string, O.Required<Partial<ScalarNode<any, S>>, 'View' | 'id'>>;
  };

export type DynamicArrayNode<V, S> = BaseNode<V[], S> & {
  index: string | number;
  selectedId: { get: () => string | null; set: (id: string | null) => void };
  onChange: (value: V[]) => void;
  add: () => void;
  removeById: (id: string) => void;
  children: IObservableValue<Array<O.Required<Partial<DynamicArrayChildNode<V, S>>, 'View' | 'id'>>>;
  selectedChild: IComputedValue<null | O.Required<Partial<DynamicArrayChildNode<V, S>>, 'View' | 'id'>>;
  allowChildEdit: boolean;
  Navigation: null | FC<any>;
};

export type DynamicArrayChildNode<V, S> = BaseNode<V, S> & {
  index: string | number;
  setSelectedId: (id: string | null) => void;
  onChange: (value: Partial<V>) => void;
  remove: () => void;
  Navigation: null | FC<any>;
  children: Record<string, O.Required<Partial<ScalarNode<any, S>>, 'View' | 'id'>>;
};

export type Node<V, S> = ScalarNode<V, S> | ArrayChildNode<V, S> | ArrayNode<V, S> | DynamicArrayNode<V, S> | ObjectNode<V, S>;

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
