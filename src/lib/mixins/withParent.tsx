import { IComputedValue } from 'mobx';

export default function withParent<V, S, P = {}>() {
  type Params = {
    value: IComputedValue<V>;
    onChange: (value: V) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
    parentOptios: P;
  };

  return function(params: Params) {
    return params;
  };
}
