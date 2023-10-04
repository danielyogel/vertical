import { v4 } from 'uuid';
import { computed, IComputedValue, IObservableValue } from 'mobx';

export function init<V extends object>(params: {
  state: IObservableValue<V>;
  node: (options: {
    index: string | number;
    id: string;
    value: IComputedValue<V>;
    onChange: (change: Partial<V>) => void;
    store: IComputedValue<V>;
    onStoreChange: (change: Partial<V>) => void;
  }) => any;
}) {
  const { node, state } = params;
  return node({
    id: v4(),
    index: 1,
    value: computed(() => state.get()),
    onChange: s => state.set({ ...state.get(), ...s }),
    store: computed(() => state.get()),
    onStoreChange: s => state.set({ ...state.get(), ...s })
  });
}
