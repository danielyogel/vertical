import { computed } from 'mobx';
import { BaseNode } from '../Interfaces';

type Node<V, S> = Pick<BaseNode<V, S>, 'store' | 'label'>;

export type Params<V, S> = {
  isVisible?: (args: Node<V, S>) => boolean;
};

export default function withVisibility<V, S>(params: Params<V, S>) {
  return function<O extends Node<V, S>>(obj: O) {
    return {
      ...obj,
      isVisible: computed(() => !params.isVisible || params.isVisible(obj))
    };
  };
}
