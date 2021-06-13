import { computed } from 'mobx';
import { Except } from 'type-fest';
import { BaseNode } from '../Interfaces';

export type Params<V, S, O> = {
  isDisabled?: (node: Except<BaseNode<V, S, O>, 'View' | 'isDisabled' | 'isVisible'>) => boolean;
};

export default function withDisabled<V, S, O>(params: Params<V, S, O>) {
  return function<VM extends Except<BaseNode<V, S, O>, 'View' | 'isDisabled' | 'isVisible'>>(vm: VM) {
    return {
      ...vm,
      isDisabled: computed(() => (params.isDisabled ? Boolean(params.isDisabled(vm)) : vm.isLoading.get()))
    };
  };
}
