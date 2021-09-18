import { computed, isBoxedObservable } from 'mobx';
import { Node } from '../Interfaces';
import { notUndefined } from '../../utils';

type Error = { message: string };

type PreviusVM<V, S, R> = Pick<Node<V, S, R>, 'value' | 'store' | 'children'>;

export type errors<V, S, R, VM extends PreviusVM<V, S, R>> = (node: VM) => Array<Error | undefined> | undefined | false;

export default function withErrors<V, S, R, VM extends PreviusVM<V, S, R>>(errors?: errors<V, S, R, VM>) {
  return function (vm: VM) {
    const { children: _children } = vm;

    return {
      ...vm,
      errors: computed(() => {
        const children = isBoxedObservable(_children) ? _children.get() : _children;

        const childrenErrors = children ? (Array.isArray(children) ? children : Object.values(children)).flatMap(vm => vm.errors?.get() ?? []) : [];

        const errrors = errors && errors(vm);

        return (errrors || childrenErrors).filter(notUndefined);
      })
    };
  };
}
