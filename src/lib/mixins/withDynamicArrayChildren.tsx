import { O } from 'ts-toolbelt';
import { IObservableValue, computed, observable, reaction } from 'mobx';
import { DynamicArrayChildNode, DynamicArrayNode, Node } from '../Interfaces';
import { isEqual, pipe, unsafeUpdateAt } from '../utils';

type PreviusVM<V, S> = Pick<DynamicArrayNode<V, S>, 'value' | 'store' | 'onChange' | 'onStoreChange'>;

type VmWithChildren<V extends Record<string, any>, S> = Pick<
  DynamicArrayChildNode<Omit<V, 'id'>, S>,
  'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | 'remove' | 'setSelectedId'
>;

type childVM<V extends Record<string, any>, S> = O.Required<Partial<DynamicArrayChildNode<V, S>>, 'View' | 'id'>;

export type Params<V extends Record<string, any>, S> = {
  child: (params: VmWithChildren<V, S>) => childVM<V, S>;
  childEdit?: (params: VmWithChildren<V, S>) => childVM<V, S>;
  defaultValue: Omit<V, 'id'>;
  selectedId?: { get: () => string | null; set: (id: string | null) => void };
};

export default function withDynamicArrayChildren<V extends { id: string }, S, VM extends PreviusVM<V, S>>(options: Params<V, S>) {
  return function (vm: VM) {
    type ChildVmType = ReturnType<(typeof options)['child']>;

    const children: IObservableValue<ChildVmType[]> = observable.box([]);

    const _selectedId: IObservableValue<null | string> = options.selectedId || observable.box(null);

    const add = () => {
      const newItem = { ...options.defaultValue, id: crypto.randomUUID() } as V;
      vm.onChange([newItem, ...vm.value.get()]);
    };

    const removeById = (id: string) => {
      const childReadID = children
        .get()
        .find(c => c.id === id)
        ?.value?.get().id;

      children.set(children.get().filter(c => c.id !== id));
      vm.onChange(vm.value.get().filter(v => v.id !== childReadID));
    };

    const selectById = (id: string | null) => {
      _selectedId.set(
        children
          .get()
          .find(c => c.id === id)
          ?.value?.get().id || null
      );
    };

    const _selectedChild = observable.box<ChildVmType | null>(null);

    const selectedId = {
      get: () => _selectedId.get(),
      set: selectById
    };

    const selectedChild = computed(() => _selectedChild.get());

    const allowChildEdit = Boolean(options.childEdit);

    //
    // reaction for syncing outside value
    //
    reaction(
      () => vm.value.get(),
      items => {
        let newChildren: ChildVmType[] = [];
        items.forEach((item, index) => {
          const VM = children.get().find(c => c.value?.get().id === item.id);

          if (VM) {
            newChildren[index] = VM;
          } else {
            const indexTouse = () => vm.value.get().findIndex(i => i.id === item.id);

            newChildren[index] = options.child({
              index: 0,
              setSelectedId: id => _selectedId.set(id),
              value: computed(() => {
                return vm.value.get()[indexTouse()];
              }),
              onChange: v => {
                return pipe(unsafeUpdateAt(indexTouse(), { ...vm.value.get()[index], ...v }, vm.value.get()), vm.onChange);
              },
              remove: () => {
                children.set(children.get().filter(c => c.value?.get().id !== item.id));
                vm.onChange(vm.value.get().filter(v => v.id !== item.id));
              },
              onStoreChange: vm.onStoreChange,
              store: vm.store
            });
          }
        });

        children.set(newChildren);
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

    //
    // reaction for initializing a new editVM when selectedId changes
    //
    reaction(
      () => _selectedId.get(),
      id => {
        const childEditConstructor = options.childEdit;

        const realId = children
          .get()
          .find(vm => vm.value?.get().id === id)
          ?.value?.get().id;

        if (!realId || !id || !childEditConstructor) {
          return _selectedChild.set(null);
        }

        const indexTouse = () => vm.value.get().findIndex(i => i.id === realId);

        const VM = childEditConstructor({
          index: 0,
          setSelectedId: id => _selectedId.set(id),
          value: computed(() => {
            return vm.value.get()[indexTouse()];
          }),
          onChange: v => {
            return pipe(unsafeUpdateAt(indexTouse(), { ...vm.value.get()[indexTouse()], ...v }, vm.value.get()), vm.onChange);
          },
          remove: () => {
            children.set(children.get().filter(c => c.value?.get().id !== realId));
            _selectedChild.set(null);
            vm.onChange(vm.value.get().filter(v => v.id !== realId));
          },
          onStoreChange: vm.onStoreChange,
          store: vm.store
        });

        _selectedChild.set(VM);
      },
      { fireImmediately: true }
    );

    return {
      ...vm,
      selectedChild,
      add,
      removeById,
      allowChildEdit,
      children,
      selectedId
    };
  };
}
