import { observable, computed, isBoxedObservable } from 'mobx';
import { Node } from '../Interfaces';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'children'>;

export default function withLoading<V, S, VM extends PreviusVM<V, S>>() {
  return function (obj: VM) {
    const _isLoading = observable.box(false);
    const _children = obj.children;

    return {
      ...obj,
      isLoading: computed(() => {
        const children = isBoxedObservable(_children) ? _children.get() : _children;

        const someChildrenLoading = children && (Array.isArray(children) ? children : Object.values(children)).some(vm => vm?.isLoading?.get());
        const isNodeLoading = _isLoading.get();

        return Boolean(isNodeLoading || someChildrenLoading);
      }),
      setLoading(isLoading: boolean) {
        _isLoading.set(isLoading);
      }
    };
  };
}
