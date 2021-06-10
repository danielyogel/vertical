import { BaseNode } from '../Interfaces';
import { observable, computed } from 'mobx';
import { isArray } from 'lodash';

type Node = Partial<BaseNode<any, any, any>>;

export default function withLoading() {
  return function<N extends Node, T extends Partial<{ children: null | Array<N> | Record<string, N> }>>(obj: T) {
    const _isLoading = observable.box(false);
    const children = obj.children;

    return {
      ...obj,
      isLoading: computed(() => {
        const someChildrenLoading = children && (isArray(children) ? children : Object.values(children)).some(vm => vm?.isLoading?.get());
        const isNodeLoading = _isLoading.get();

        return Boolean(isNodeLoading || someChildrenLoading);
      }),
      setLoading(isLoading: boolean) {
        _isLoading.set(isLoading);
      }
    };
  };
}
