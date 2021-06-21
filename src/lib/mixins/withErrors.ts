import { computed } from 'mobx';
import { BaseNode } from '../Interfaces';
import { notUndefined } from '../../utils';

type Error = { message: string };

type Node<V, S> = Pick<BaseNode<V, S>, 'value' | 'store'> & {
  children: null | Array<Partial<BaseNode<any, S>>> | Record<string, Partial<BaseNode<any, S>>>;
};

export type errors<V, S, VM extends Node<V, S>> = (node: VM) => Array<Error | undefined> | undefined | false;

export default function withErrors<V, S, VM extends Node<V, S>>(errors?: errors<V, S, VM>) {
  return function(vm: VM) {
    const { children } = vm;

    return {
      ...vm,
      errors: computed(() => {
        const childrenErrors = children ? (Array.isArray(children) ? children : Object.values(children)).flatMap(vm => vm.errors?.get() ?? []) : [];

        const errrors = errors && errors(vm);

        return (errrors || childrenErrors).filter(notUndefined);
      })
    };
  };
}
