import { computed, IComputedValue } from 'mobx';
import { pipe, toArray, map } from '../../utils';
import { NodeFn } from '../BaseNode';
import { GetVal } from '../GetVaueTypes';

type Params<K extends string, C extends Record<K, NodeFn>> = {
  children: C;
  value: IComputedValue<GetVal<C>>;
  onChange: (value: GetVal<C>) => void;
  store: IComputedValue<any>;
  onStoreChange: (change: Partial<any>) => void;
};

export default function bindChildrenToParams<K extends string, C extends Record<K, NodeFn>>(params: Params<K, C>) {
  const { children, value, onChange, store, onStoreChange } = params;

  return pipe(
    children,
    toArray,
    map(([key, node]) => {
      return [
        key,
        node({
          value: computed(() => value.get()[key]),
          onChange: val => onChange({ ...value.get(), [key]: val }),
          store,
          onStoreChange
        })
      ];
    }),
    entries => Object.fromEntries(entries)
  );
}
