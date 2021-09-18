import { IComputedValue } from 'mobx';
import { ArrayProps } from '../Interfaces';

export default function withArrayChildParent<V, S, R>() {
  type Params = ArrayProps & {
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
