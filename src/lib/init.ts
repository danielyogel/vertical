import { v4 } from 'uuid';
import { computed, IComputedValue, IObservableValue } from 'mobx';

type Params<V extends Record<string, any>> = {
  state: IObservableValue<V>;
  node: (options: {
    index: string | number;
    id: string;
    value: IComputedValue<V>;
    onChange: (change: any) => void;
    store: IComputedValue<V>;
    onStoreChange: (change: Partial<V>) => void;
  }) => any;
};

export function init<V extends Record<string, any>>(params: Params<V>) {
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
