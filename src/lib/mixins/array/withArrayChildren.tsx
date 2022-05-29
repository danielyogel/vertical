import { computed, IComputedValue, observable } from 'mobx';
import { O } from 'ts-toolbelt';
import { ArrayProps, Node, ArrayChildNode } from '../../Interfaces';

type MinimalPreviusVM<V, S> = {
  value: IComputedValue<V>;
  onChange: (value: Partial<V>) => void;
  store: IComputedValue<S>;
  onStoreChange: (change: Partial<S>) => void;
  index: string | number;
};

export type WithArrayChildrenOptions<V, S> = {
  children: ReadonlyArray<
    (
      parent: Pick<ArrayChildNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | keyof ArrayProps>
    ) => O.Required<Partial<Node<Partial<V>, S>>, 'View' | 'id'>
  >;
  currentIndex?: {
    get: () => number;
    set: (id: number) => void;
  };
};

export function withArrayChildren<V, S>(params: WithArrayChildrenOptions<V, S>) {
  return function <VM extends MinimalPreviusVM<V, S>>(vm: VM) {
    const currentIndex = params.currentIndex || observable.box(1);
    const back = () => currentIndex.set(currentIndex.get() - 1);
    const next = () => currentIndex.set(currentIndex.get() + 1);
    return {
      ...vm,
      autoFocus: false,
      currentIndex,
      isFirst: computed(() => currentIndex.get() === 1),
      isLast: computed(() => currentIndex.get() === params.children.length),
      back,
      next,
      children: [...params.children].map((node, index) => {
        return node({
          ...vm,
          index,
          currentIndex,
          isFirst: computed(() => index === 0),
          isLast: computed(() => index + 1 === params.children.length),
          back,
          next
        });
      })
    };
  };
}
