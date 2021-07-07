import { IComputedValue } from 'mobx';

export default function withArrayParent<V, S>() {
  type Params = {
    value: IComputedValue<V>;
    onChange: (value: Partial<V>) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
  };

  return function (params: Params) {
    return params;
  };
}
