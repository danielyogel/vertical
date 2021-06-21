import { computed } from 'mobx';
import { BaseNode } from '../Interfaces';

export type isSelected<V, S, VM extends Pick<BaseNode<V, S>, 'value' | 'store'>> = (vm: VM) => boolean;

export default function withSelected<V, S, VM extends Pick<BaseNode<V, S>, 'value' | 'store'>>(isSelected?: isSelected<V, S, VM>) {
  return function(vm: VM) {
    return {
      ...vm,
      isSelected: computed(() => !isSelected || isSelected(vm))
    };
  };
}
