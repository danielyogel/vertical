import { Node } from '../Interfaces';

type PreviusVM<V, S, R> = Pick<Node<V, S, R>, 'value' | 'store' | 'children'>;

export type context<V, S, VM extends PreviusVM<V, S, R>, R> = (vm: VM) => R;

export default function withContext<V, S, VM extends PreviusVM<V, S, R>, R>(context?: context<V, S, VM, R>) {
  return function (vm: VM) {
    return {
      ...vm,
      ...(context && context(vm))
    };
  };
}
