import { computed } from 'mobx';
import { Node } from '../Interfaces';

type PreviusVM<V, S, R> = Pick<Node<V, S, R>, 'value' | 'store' | 'children'>;

export type isSelected<V, S, R, VM extends PreviusVM<V, S, R>> = (vm: VM) => boolean;

export default function withSelected<V, S, R, VM extends PreviusVM<V, S, R>>(isSelected?: isSelected<V, S, R, VM>) {
  return function (vm: VM) {
    return {
      ...vm,
      isSelected: computed(() => !isSelected || isSelected(vm))
    };
  };
}
