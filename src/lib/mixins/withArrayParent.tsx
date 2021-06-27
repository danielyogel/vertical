import { IComputedValue } from 'mobx';
import { Special } from '../nodes/NodeArray';

export default function withArrayParent<V, S, Extra = {}>() {
  type Params = Extra &
    Special & {
      value: IComputedValue<V>;
      onChange: (value: V) => void;
      store: IComputedValue<S>;
      onStoreChange: (change: Partial<S>) => void;
    };

  return function (params: Params) {
    return params;
  };
}
