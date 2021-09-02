import { computed, observable, reaction } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, isEqual, pipe, unsafeUpdateAt } from '../../utils';
import { DynamicArrayChildNode, DynamicArrayNode } from '../Interfaces';
import { withLoading, withMeta, withId, withSkalarParent, withProgress, withSelected, withView } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import withVisibility, { isVisible as isVisibleParams } from '../mixins/withVisibility';
import withDisabled, { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import withErrors, { errors as errorsParams } from '../mixins/withErrors';
import { nanoid } from 'nanoid';

export default function <S>(params: { Render: FC<Except<DynamicArrayNode<any, S>, 'View'>> }) {
  return function <V extends { id: string }>(options: {
    isSelected?: isSelectedParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible'>>;
    autoFocus?: boolean;
    label?: string;
    child: (
      params: Pick<DynamicArrayChildNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | 'remove'>
    ) => O.Required<Partial<DynamicArrayChildNode<V, S>>, 'View' | 'id'>;
    defaultValue: Omit<V, 'id'>;
  }) {
    return flow(withSkalarParent<V[], S>(), vm => {
      return pipe(
        vm,
        withId(),
        vm => {
          const _children = observable.box<Array<ReturnType<typeof options['child']>>>([]);

          reaction(
            () => vm.value.get(),
            items => {
              let newChildren: Array<ReturnType<typeof options['child']>> = [];
              items.forEach((item, index) => {
                const indexTouse = () => vm.value.get().findIndex(i => i.id === item.id);

                const VM =
                  _children.get().find(c => c.value?.get().id === item.id) ??
                  options.child({
                    index: 0,
                    value: computed(() => {
                      return vm.value.get()[indexTouse()];
                    }),
                    onChange: v => {
                      return pipe(unsafeUpdateAt(indexTouse(), { ...vm.value.get()[index], ...v }, vm.value.get()), vm.onChange);
                    },
                    remove: () => {
                      _children.set(_children.get().filter(c => c.value?.get().id !== item.id));
                      vm.onChange(vm.value.get().filter(v => v.id !== item.id));
                    },
                    onStoreChange: vm.onStoreChange,
                    store: vm.store
                  });

                newChildren[index] = VM;

                _children.set(newChildren);
              });
            },
            {
              fireImmediately: true,
              delay: 50,
              equals: (a, b) =>
                isEqual(
                  a.map(i => i.id),
                  b.map(i => i.id)
                )
            }
          );

          const _add = () => {
            const newItem = { ...options.defaultValue, id: nanoid() } as V;
            vm.onChange([newItem, ...vm.value.get()]);
          };

          return {
            ...vm,
            autoFocus: options?.autoFocus ?? false,
            add: _add,
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
