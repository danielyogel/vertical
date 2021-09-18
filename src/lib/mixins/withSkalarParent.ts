import { IComputedValue } from 'mobx';

export default function withSkalarParent<V, S, R>() {
  type Params = {
    value: IComputedValue<V>;
    onChange: (value: V) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
    index: string | number;
    context: R;
  };

  return function (params: Params) {
    return params;
  };
}
