import { IComputedValue } from 'mobx';
import { ArrayProps } from '../../Interfaces';

export default function withArrayChildParent<V, S>() {
  type Params = ArrayProps & {
    value: IComputedValue<V>;
    onChange: (value: Partial<V>) => void;
    store: IComputedValue<S>;
    onStoreChange: (change: Partial<S>) => void;
    index: string | number;
  };

  return function (params: Params) {
    return params;
  };
}
