import { computed } from 'mobx';
import { Node } from '../Interfaces';

type PreviusVM<V, S, R> = Pick<Node<V, S, R>, 'value' | 'store' | 'label'>;

export type isVisible<V, S, R, VM extends PreviusVM<V, S, R>> = (vm: VM) => boolean;

export default function withVisibility<V, S, R, VM extends PreviusVM<V, S, R>>(isVisible?: isVisible<V, S, R, VM>) {
  return function (vm: VM) {
    return {
      ...vm,
      isVisible: computed(() => !isVisible || isVisible(vm))
    };
  };
}
