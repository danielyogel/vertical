import { computed, observable } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, pipe, unsafeUpdateAt } from '../../utils';
import { DynamicArrayChildNode, DynamicArrayNode } from '../Interfaces';
import { withLoading, withMeta, withId, withSkalarParent, withProgress, withSelected, withView } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import withVisibility, { isVisible as isVisibleParams } from '../mixins/withVisibility';
import withDisabled, { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import withErrors, { errors as errorsParams } from '../mixins/withErrors';

export default function <S>(params: { Render: FC<Except<DynamicArrayNode<any, S>, 'View'>> }) {
  return function <V>(options: {
    isSelected?: isSelectedParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible'>>;
    autoFocus?: boolean;
    label?: string;
    child: (
      params: Pick<DynamicArrayChildNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>
    ) => O.Required<Partial<DynamicArrayChildNode<V, S>>, 'View' | 'id'>;
  }) {
    return flow(withSkalarParent<V[], S>(), vm => {
      return pipe(
        vm,
        withId(),
        vm => {
          const _children = observable.box(
            vm.value.get().map((_, index) => {
              return options.child({
                index,
                value: computed(() => vm.value.get()[index]),
                onChange: v => pipe(unsafeUpdateAt(index, { ...vm.value.get()[index], ...v }, vm.value.get()), vm.onChange),
                onStoreChange: vm.onStoreChange,
                store: vm.store
              });
            })
          );

          return {
            ...vm,
            autoFocus: options?.autoFocus ?? false,
            children: _children
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
