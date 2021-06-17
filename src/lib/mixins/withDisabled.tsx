import { computed } from 'mobx';
import { Except } from 'type-fest';
import { BaseNode } from '../Interfaces';

export type Params<V, S> = {
  isDisabled?: (node: Except<BaseNode<V, S>, 'View' | 'isDisabled' | 'isVisible'>) => boolean;
};

export default function withDisabled<V, S>(params: Params<V, S>) {
  return function<VM extends Except<BaseNode<V, S>, 'View' | 'isDisabled' | 'isVisible'>>(vm: VM) {
    return {
      ...vm,
      isDisabled: computed(() => Boolean(params.isDisabled ? params.isDisabled(vm) : vm.isLoading.get() || vm.errors.get().length))
    };
  };
}
