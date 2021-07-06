import { computed } from 'mobx';
import { Node } from '../Interfaces';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store'>;

export type isSelected<V, S, VM extends PreviusVM<V, S>> = (vm: VM) => boolean;

export default function withSelected<V, S, VM extends PreviusVM<V, S>>(isSelected?: isSelected<V, S, VM>) {
  return function (vm: VM) {
    return {
      ...vm,
      isSelected: computed(() => !isSelected || isSelected(vm))
    };
  };
}
