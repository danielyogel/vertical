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

export default function withObjectChildren<V, S, VM extends PreviusVM<any, any>, C extends Children<V, S>>(options: { children: C }) {
  return function (prevVM: VM) {
    const _children = options.children as any;

    return {
      ...prevVM,
      children: pipe(
        keys(options.children),
        map(key => {
          const _value = prevVM.value.get() as any;

          const instance = (_children[key] as any)({
            ...prevVM,
            value: computed(() => _value[key]) as any,
            onChange: (val: any) => prevVM.onChange({ ...prevVM.value.get(), [key]: val } as any) as any,
            index: key
          });

          return [key, instance] as const;
        }),
        e => Object.fromEntries(e)
      )
    };
  };
}
