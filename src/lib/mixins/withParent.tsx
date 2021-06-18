import { IComputedValue } from 'mobx';

export default function withParent<V, S, Extra = {}>() {
  type Params = Extra & {
    value: IComputedValue<V>;
    onChange: (value: V) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
  };

  return function(params: Params) {
    return params;
  };
}
