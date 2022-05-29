import { nanoid } from 'nanoid';
import { O } from 'ts-toolbelt';
import { computed, IComputedValue, IObservableValue } from 'mobx';
import { Node } from '../Interfaces';

type Params<V> = {
  state: IObservableValue<V>;
  node: (options: {
    index: string | number;
    id: string;
    value: IComputedValue<V>;
    onChange: (change: Partial<V>) => void;
    store: IComputedValue<V>;
    onStoreChange: (change: Partial<V>) => void;
  }) => O.Required<Partial<Node<Partial<V>, V>>, 'View' | 'id'>;
};

export function NodeContainer<V>({ state, node }: Params<V>) {
  return node({
    id: nanoid(),
    index: 1,
    value: computed(() => state.get()),
    onChange: s => state.set({ ...state.get(), ...s }),
    store: computed(() => state.get()),
    onStoreChange: s => state.set({ ...state.get(), ...s })
  });
}
