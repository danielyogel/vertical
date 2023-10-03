import { computed } from 'mobx';
import { Children, Node } from '../Interfaces';
import { keys, map, pipe } from '../utils';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'onChange'>;

type Params<V extends Record<string, any>, S> = {
  children: Children<V, S>;
};

export default function withObjectChildren<V extends Record<string, any>, S, VM extends PreviusVM<any, any>>(options: Params<V, S>) {
  return function (vm: VM) {
    return {
      ...vm,
      children: pipe(
        keys(options.children),
        map(key => {
          const instance = (options.children[key] as any)({
            ...vm,
            value: computed(() => vm.value.get()[key]) as any,
            onChange: (val: any) => vm.onChange({ ...vm.value.get(), [key]: val }) as any,
            index: key
          });

          return [key, instance] as const;
        }),
        e => Object.fromEntries(e)
      )
    };
  };
}
