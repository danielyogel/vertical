import { computed, observable, reaction } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { nanoid } from 'nanoid';
import { FC, flow, isEqual, pipe, unsafeUpdateAt } from '../../utils';
import { DynamicArrayChildNode, DynamicArrayNode } from '../Interfaces';
import { withLoading, withMeta, withId, withSkalarParent, withProgress, withSelected, withView } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import withVisibility, { isVisible as isVisibleParams } from '../mixins/withVisibility';
import withDisabled, { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import withErrors, { errors as errorsParams } from '../mixins/withErrors';
import { context as contextParams } from '../mixins/withContext';

export default function <S>(params: { Render: FC<Except<DynamicArrayNode<any, S, any>, 'View'>> }) {
  return function <V extends { id: string }, R>(options: {
    context?: contextParams<any, S, Except<DynamicArrayNode<V[], S, any>, 'View' | 'isVisible'>, R>;
    isSelected?: isSelectedParams<any, S, Except<DynamicArrayNode<V, S, R>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<DynamicArrayNode<V, S, R>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<DynamicArrayNode<V, S, R>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<DynamicArrayNode<V, S, R>, 'View' | 'isVisible'>>;
    autoFocus?: boolean;
    label?: string;
    child: (
      params: Pick<
        DynamicArrayChildNode<Omit<V, 'id'>, S, R>,
        'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | 'remove' | 'setSelectedId'
      >
    ) => O.Required<Partial<DynamicArrayChildNode<Partial<V>, S, any>>, 'View' | 'id'>;
    childEdit?: (
      params: Pick<
        DynamicArrayChildNode<Omit<V, 'id'>, S, R>,
        'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | 'remove' | 'setSelectedId'
      >
    ) => O.Required<Partial<DynamicArrayChildNode<Partial<V>, S, any>>, 'View' | 'id'>;
    defaultValue: Omit<V, 'id'>;
    selectedId?: { get: () => string | null; set: (id: string | null) => void };
  }) {
    return flow(withSkalarParent<V[], S, any>(), vm => {
      return pipe(
        vm,
        withId(),
        vm => {
          const _children = observable.box<Array<ReturnType<typeof options['child']>>>([]);

          const _selectedId = options.selectedId || observable.box<null | string>(null);

          const _selectedChild = observable.box<null | ReturnType<typeof options['child']>>(null);

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
                    setSelectedId: id => _selectedId.set(id),
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
              });

              _children.set(newChildren);
            },
            {
              fireImmediately: true,
              equals: (a, b) =>
                isEqual(
                  a.map(i => i.id),
                  b.map(i => i.id)
                )
            }
          );

          reaction(
            () => _selectedId.get(),
            id => {
              const newLocal = options.childEdit;

              const realId = _children
                .get()
                .find(vm => vm.value?.get().id === id)
                ?.value?.get().id;

              if (!realId || !id || !newLocal) {
                return _selectedChild.set(null);
              }

              const indexTouse = () => vm.value.get().findIndex(i => i.id === realId);

              const _vm = newLocal({
                index: 0,
                setSelectedId: id => _selectedId.set(id),
                value: computed(() => {
                  return vm.value.get()[indexTouse()];
                }),
                onChange: v => {
                  return pipe(unsafeUpdateAt(indexTouse(), { ...vm.value.get()[indexTouse()], ...v }, vm.value.get()), vm.onChange);
                },
                remove: () => {
                  _children.set(_children.get().filter(c => c.value?.get().id !== realId));
                  _selectedChild.set(null);
                  vm.onChange(vm.value.get().filter(v => v.id !== realId));
                },
                onStoreChange: vm.onStoreChange,
                store: vm.store
              });

              _selectedChild.set(_vm);
            },
            { fireImmediately: true }
          );

          const _add = () => {
            const newItem = { ...options.defaultValue, id: nanoid() } as V;
            vm.onChange([newItem, ...vm.value.get()]);
          };

          const _removeById = (id: string) => {
            const childReadID = _children
              .get()
              .find(c => c.id === id)
              ?.value?.get().id;
            _children.set(_children.get().filter(c => c.id !== id));
            vm.onChange(vm.value.get().filter(v => v.id !== childReadID));
          };

          return {
            ...vm,
            selectedChild: computed(() => _selectedChild.get()),
            autoFocus: options?.autoFocus ?? false,
            add: _add,
            removeById: _removeById,
            allowChildEdit: !!options.childEdit,
            children: _children,
            selectedId: {
              get() {
                return _selectedId.get();
              },
              set(id: string | null) {
                return _selectedId.set(
                  _children
                    .get()
                    .find(c => c.id === id)
                    ?.value?.get().id || null
                );
              }
            }
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
