import { IComputedValue } from 'mobx';

export default function withDynamicChildParent<V, S, R>() {
  type Params = {
    value: IComputedValue<V>;
    onChange: (value: Partial<V>) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
    index: string | number;
    setSelectedId: (id: string | null) => void;
    remove: () => void;
    context: R;
  };

  return function (params: Params) {
    return params;
  };
}
