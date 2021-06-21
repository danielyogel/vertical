import { computed, IComputedValue, IObservableValue, observable } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, pipe } from '../../utils';
import { BaseNode, InferArrayValue } from '../Interfaces';
import { withLoading, withParent, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors, withMeta } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';

export type Special = {
  currentIndex: IObservableValue<number>;
  isFirst: IComputedValue<boolean>;
  isLast: IComputedValue<boolean>;
  back: () => void;
  next: () => void;
};

type ChildrenKeys = 'onChange' | 'onStoreChange' | 'store' | 'value' | 'currentIndex';

type Child = O.Required<Partial<BaseNode<any, any>>, 'View'>;

type VM<S> = BaseNode<any, S> & { children: Array<Child> } & Special;

type Children<S> = ReadonlyArray<(parent: Pick<VM<S>, ChildrenKeys> & Special) => Child>;

type Renderer<S> = FC<Except<VM<S>, 'View'>>;

export default function<S>(params: { Render: Renderer<S> }) {
  type Options<C extends Children<S>> = {
    isSelected?: isSelectedParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
  } & VisibilityParams<any, S> &
    DisabledParams<any, S> &
    MetaParams & { children: C };

  return function<C extends Children<S>>(options: Options<C>) {
    return flow(withParent<O.MergeAll<{}, InferArrayValue<C>>, S>(), vm => {
      return pipe(
        vm,
        vm => {
          const currentIndex = observable.box(1);
          const back = () => currentIndex.set(currentIndex.get() - 1);
          const next = () => currentIndex.set(currentIndex.get() + 1);
          return {
            ...vm,
            currentIndex,
            isFirst: computed(() => currentIndex.get() === 1),
            isLast: computed(() => currentIndex.get() === options.children.length),
            back,
            next,
            index: null,
            children: [...options.children].map((node, index) => {
              return node({
                ...vm,
                currentIndex,
                isFirst: computed(() => index === 0),
                isLast: computed(() => index + 1 === options.children.length),
                back,
                next
              });
            })
          };
        },
        withMeta(options),
        withLoading(),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options),
        withVisibility(options),
        withView(params.Render)
      );
    });
  };
}
