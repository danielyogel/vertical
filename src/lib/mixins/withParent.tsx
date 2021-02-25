import { IComputedValue } from 'mobx';

export default function withParent<V, S>() {
  return function(params: {
    value: IComputedValue<V>;
    onChange: (value: V) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
  }) {
    return params;
  };
}
