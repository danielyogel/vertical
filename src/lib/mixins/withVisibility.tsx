import { computed, IComputedValue } from 'mobx';

export type Params<S> = {
  isVisible?: (args: { store: IComputedValue<S> }) => boolean;
};

export default function withVisibility<S>(params: Params<S>) {
  return function<O extends { store: IComputedValue<S> }>(obj: O) {
    return {
      ...obj,
      isVisible: computed(() => !params.isVisible || params.isVisible(obj))
    };
  };
}
