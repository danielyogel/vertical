import { computed, IComputedValue } from 'mobx';

export type Params<S> = {
  isSelected?: (args: { store: IComputedValue<S> }) => boolean;
};

export default function withSelected<S>(params: Params<S>) {
  return function<O extends { store: IComputedValue<S> }>(obj: O) {
    return {
      ...obj,
      isSelected: computed(() => !params.isSelected || params.isSelected(obj))
    };
  };
}
