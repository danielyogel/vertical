import { computed } from 'mobx';
import { Node } from '../Interfaces';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'label'>;

export type isVisible<V, S, VM extends PreviusVM<V, S>> = (vm: VM) => boolean;

export default function withVisibility<V, S, VM extends PreviusVM<V, S>>(isVisible?: isVisible<V, S, VM>) {
  return function (vm: VM) {
    return {
      ...vm,
      isVisible: computed(() => !isVisible || isVisible(vm))
    };
  };
}
