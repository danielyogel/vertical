import { computed, observable } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, pipe } from '../../utils';
import { ArrayNode, ArrayProps, Node, RecordNode } from '../Interfaces';
import {
  withLoading,
  withArrayParent,
  withProgress,
  withSelected,
  withVisibility,
  withView,
  withDisabled,
  withErrors,
  withMeta,
  withId
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export default function <S>(params: { Render: FC<Except<ArrayNode<S, S>, 'View'>> }) {
  return function (options: {
    isSelected?: isSelectedParams<any, S, Except<ArrayNode<S, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<ArrayNode<S, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<ArrayNode<S, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<ArrayNode<S, S>, 'View' | 'isVisible'>>;
    autoFocus?: boolean;
    label?: string | null;
    children: ReadonlyArray<
      (
        parent: Pick<RecordNode<S, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | keyof ArrayProps>
      ) => O.Required<Partial<Node<Partial<S>, S>>, 'View' | 'id'>
    >;
  }) {
    return flow(withArrayParent<S, S>(), vm => {
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
            index: vm.index,
            children: [...options.children].map((node, index) => {
              return node({
                ...vm,
                index,
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
