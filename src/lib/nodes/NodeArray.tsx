import { computed, IComputedValue, IObservableValue, observable } from 'mobx';
import { Except, SetRequired } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow } from '../../utils';
import { BaseNode, InferArrayValue } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility, withView, withDisabled } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Params as DisabledParams } from '../mixins/withDisabled';

type ChildrenKeys = 'onChange' | 'onStoreChange' | 'options' | 'store' | 'value' | 'currentIndex';

type Child = SetRequired<Partial<BaseNode<any, any, any>>, 'View'>;

type VM<S, O> = BaseNode<any, S, O> & {
  currentIndex: IObservableValue<number>;
  isFirst: IComputedValue<boolean>;
  isLast: IComputedValue<boolean>;
  back: () => void;
  next: () => void;
  children: Array<Child>;
};

type Children<S, O> = ReadonlyArray<(parent: Pick<VM<S, O>, ChildrenKeys>) => Child>;

type Renderer<S, O> = FC<Except<VM<S, O>, 'View'>>;

export default function<S, O>(params: { Render: Renderer<S, O> }) {
  return function<C extends Children<S, O>>(
    options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & DisabledParams<any, S, O> & { children: C }
  ) {
    return flow(
      withParent<O.MergeAll<{}, InferArrayValue<C>>, S>(),
      withOptions(options),
      vm => {
        const currentIndex = observable.box(1);
        return {
          ...vm,
          currentIndex,
          isFirst: computed(() => currentIndex.get() === 1),
          isLast: computed(() => currentIndex.get() === options.children.length),
          back: () => currentIndex.set(currentIndex.get() - 1),
          next: () => currentIndex.set(currentIndex.get() + 1),
          children: [...options.children].map(node => node({ ...vm, currentIndex }))
        };
      },
      withLoading(),
      withProgress(),
      withSelected(options),
      withDisabled(options),
      withVisibility(options),
      withView(params.Render)
    );
  };
}
