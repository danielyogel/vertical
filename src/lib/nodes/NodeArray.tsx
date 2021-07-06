import { computed, IComputedValue, IObservableValue, observable } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, pipe } from '../../utils';
import { InferArrayValue, ArrayNode, Node } from '../Interfaces';
import { withLoading, withParent, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors, withMeta } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export type ArrayProps = {
  currentIndex: IObservableValue<number>;
  isFirst: IComputedValue<boolean>;
  isLast: IComputedValue<boolean>;
  back: () => void;
  next: () => void;
};

type ChildrenKeys = 'onChange' | 'onStoreChange' | 'store' | 'value' | 'currentIndex';

type Child = O.Required<Partial<Node<any, any>>, 'View'>;

type VM<S> = ArrayNode<any, S> & { children: Array<Child> } & ArrayProps;

type Children<S> = ReadonlyArray<(parent: Pick<VM<S>, ChildrenKeys> & ArrayProps) => Child>;

type Renderer<S> = FC<Except<VM<S>, 'View'>>;

export default function <S>(params: { Render: Renderer<S> }) {
  type Options<C extends Children<S>> = {
    isSelected?: isSelectedParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<VM<S>, 'View' | 'isVisible'>>;
    autoFocus?: boolean;
    label?: string;
  } & { children: C };

  return function <C extends Children<S>>(options: Options<C>) {
    return flow(withParent<O.MergeAll<{}, InferArrayValue<C>>, S>(), vm => {
      return pipe(
        vm,
        vm => {
          const currentIndex = observable.box(1);
          const back = () => currentIndex.set(currentIndex.get() - 1);
          const next = () => currentIndex.set(currentIndex.get() + 1);
          return {
            ...vm,
            autoFocus: options?.autoFocus ?? false,
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
        withMeta({ label: options.label }),
        withLoading(),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options.isDisabled),
        withVisibility(options.isVisible),
        withView(params.Render)
      );
    });
  };
}
