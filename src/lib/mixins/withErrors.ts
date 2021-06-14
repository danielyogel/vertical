import { computed } from 'mobx';
import { Except } from 'type-fest';
import { BaseNode } from '../Interfaces';

type Error = { message: string };

type Node<V, S, O> = Except<BaseNode<V, S, O>, 'View' | 'isDisabled' | 'isVisible' | 'errors'> & {
  children: null | Array<Partial<BaseNode<any, S, O>>> | Record<string, Partial<BaseNode<any, S, O>>>;
};

export type Params<V, S, O> = {
  errrors?: (node: Node<V, S, O>) => Array<Error | undefined> | undefined | false;
};

export default function withErrors<V, S, O>(params: Params<V, S, O>) {
  return function<VM extends Node<V, S, O>>(vm: VM) {
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

const notUndefined = <T>(v: T | undefined): v is T => v !== undefined;
