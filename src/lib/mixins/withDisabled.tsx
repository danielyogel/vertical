import { computed } from 'mobx';
import { BaseNode } from '../Interfaces';

type Node<V, S> = Pick<BaseNode<V, S>, 'isLoading' | 'errors' | 'store' | 'label' | 'progress' | 'value'>;

export type Params<V, S> = {
  isDisabled?: (node: Node<V, S>) => boolean;
};

export default function withDisabled<V, S>(params: Params<V, S>) {
  return function<VM extends Node<V, S>>(vm: VM) {
    return {
      ...vm,
      isDisabled: computed(() => Boolean(params.isDisabled ? params.isDisabled(vm) : vm.isLoading.get() || vm.errors.get().length))
    };
  };
}
