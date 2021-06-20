import { computed } from 'mobx';
import { BaseNode } from '../Interfaces';

type Node<V, S> = Pick<BaseNode<V, S>, 'store' | 'label' | 'value' | 'onChange'>;

export type Params<V, S> = {
  isSelected?: (node: Node<V, S>) => boolean;
};

export default function withSelected<V, S>(params: Params<V, S>) {
  return function<VM extends Node<V, S>>(vm: VM) {
    return {
      ...vm,
      isSelected: computed(() => !params.isSelected || params.isSelected(vm))
    };
  };
}
