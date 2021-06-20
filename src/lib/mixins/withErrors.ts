import { computed } from 'mobx';
import { Except } from 'type-fest';
import { BaseNode } from '../Interfaces';
import { notUndefined } from '../../utils';

type Error = { message: string };

type Node<V, S> = Except<BaseNode<V, S>, 'View' | 'isDisabled' | 'isVisible' | 'errors'> & {
  children: null | Array<Partial<BaseNode<any, S>>> | Record<string, Partial<BaseNode<any, S>>>;
};

export type Params<V, S> = {
  errrors?: (node: Node<V, S>) => Array<Error | undefined> | undefined | false;
};

export default function withErrors<V, S>(params: Params<V, S>) {
  return function<VM extends Node<V, S>>(vm: VM) {
    const children = vm.children;

    const errors = computed(() => {
      const childrenErrors = children ? (Array.isArray(children) ? children : Object.values(children)).flatMap(vm => vm.errors?.get() ?? []) : [];

      const errrors = params.errrors && params.errrors(vm);

      return (errrors || childrenErrors).filter(notUndefined);
    });
    return {
      ...vm,
      errors
    };
  };
}
