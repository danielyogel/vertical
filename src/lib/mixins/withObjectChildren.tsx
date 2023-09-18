import { observable, computed, isBoxedObservable } from 'mobx';
import { Node, ScalarNode } from '../Interfaces';
import { keys, map, pipe } from '../utils';
import { O } from 'ts-toolbelt';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'onChange'>;

type ChildFunction<V, K extends keyof V, S> = (
  params: Pick<ScalarNode<V[K], S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>
) => O.Required<Partial<Node<V[K], S>>, 'View' | 'id'>;

export type Children<V, S> = Partial<{
  [K in keyof V]: ChildFunction<V, K, S>;
}>;

export default function withObjectChildren<V extends Record<string, any>, S, VM extends PreviusVM<any, any>>(options: { children: Children<V, S> }) {
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
