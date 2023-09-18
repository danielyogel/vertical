import { ArrayChildNode, ArrayProps, Node } from '../Interfaces';
import { keys, map, pipe } from '../utils';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'onChange'>;

type ChildFunction<V, S> = (
  params: Pick<ArrayChildNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | keyof ArrayProps>
) => Pick<ArrayChildNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | keyof ArrayProps>;

export type Children<V, S> = Partial<{
  [K: string]: ChildFunction<V, S>;
}>;

export default function withObjectLogicalChildren<V extends Record<string, any>, S, VM extends PreviusVM<any, any>>(options: { children: Children<V, S> }) {
  return function (vm: VM) {
    return {
      ...vm,
      children: pipe(
        keys(options.children),
        map(key => {
          const instance = (options.children[key] as any)({
            ...vm,
            value: vm.value,
            onChange: vm.onChange,
            index: key
          });

          return [key, instance] as const;
        }),
        e => Object.fromEntries(e)
      )
    };
  };
}
