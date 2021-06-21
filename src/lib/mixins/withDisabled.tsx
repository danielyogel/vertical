import { computed } from 'mobx';
import { BaseNode } from '../Interfaces';

type PreviusVM<V, S> = Pick<BaseNode<V, S>, 'value' | 'store' | 'isLoading' | 'errors'>;

export type isDisabled<V, S, VM extends PreviusVM<V, S>> = (vm: VM) => boolean;

export default function withDisabled<V, S, VM extends PreviusVM<V, S>>(isDisabled?: isDisabled<V, S, VM>) {
  return function(vm: VM) {
    return {
      ...vm,
      isDisabled: computed(() => Boolean(isDisabled ? isDisabled(vm) : vm.isLoading.get() || vm.errors.get().length))
    };
  };
}
