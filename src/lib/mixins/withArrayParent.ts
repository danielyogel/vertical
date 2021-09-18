import { IComputedValue } from 'mobx';

export default function withArrayParent<V, S, R>() {
  type Params = {
    value: IComputedValue<V>;
    onChange: (value: Partial<V>) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
    index: string | number;
    context: R;
  };

  return function (params: Params) {
    return params;
  };
}
