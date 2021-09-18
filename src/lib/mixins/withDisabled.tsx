import { computed } from 'mobx';
import { Node } from '../Interfaces';

type PreviusVM<V, S, R> = Pick<Node<V, S, R>, 'value' | 'store' | 'isLoading' | 'errors'>;

export type isDisabled<V, S, R, VM extends PreviusVM<V, S, R>> = (vm: VM) => boolean;

export default function withDisabled<V, S, R, VM extends PreviusVM<V, S, R>>(isDisabled?: isDisabled<V, S, R, VM>) {
  return function (vm: VM) {
    return {
      ...vm,
      isDisabled: computed(() => Boolean(isDisabled ? isDisabled(vm) : vm.isLoading.get() || vm.errors.get().length))
    };
  };
}
