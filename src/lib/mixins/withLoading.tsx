import { BaseNode } from '../Interfaces';
import { observable, computed } from 'mobx';

export default function withLoading<N extends Partial<BaseNode<any, any>>>() {
  return function(obj: N) {
    const _isLoading = observable.box(false);
    const children = obj.children;

    return {
      ...obj,
      isLoading: computed(() => {
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
