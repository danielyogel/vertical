import { computed, IComputedValue, IObservableValue, observable } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, pipe } from '../../utils';
import { ArrayNode, Node } from '../Interfaces';
import { withLoading, withParent, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors, withMeta, withId } from '../mixins';
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

type VM<S> = ArrayNode<S, S> & ArrayProps & { children: Array<O.Required<Partial<Node<any, any>>, 'View'>> };

export default function <S>(params: { Render: FC<Except<VM<S>, 'View'>> }) {
  return function (options: {
    isSelected?: isSelectedParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<VM<S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<VM<S>, 'View' | 'isVisible'>>;
    autoFocus?: boolean;
    label?: string;
    children: ReadonlyArray<
      (
        parent: Pick<VM<S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'currentIndex'> & ArrayProps
      ) => O.Required<Partial<Node<Partial<S>, S>>, 'View'>
    >;
  }) {
    return flow(withParent<S, S>(), vm => {
      return pipe(
        vm,
        withId(),
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
