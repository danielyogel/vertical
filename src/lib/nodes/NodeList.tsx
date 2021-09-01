// import { computed, observable } from 'mobx';
// import { O } from 'ts-toolbelt';
// import { Except } from 'type-fest';
// import { FC, flow, pipe } from '../../utils';
// import { DynamicArrayNode, ScalarNode } from '../Interfaces';
// import { withSkalarParent, withId, withMeta, withLoading, withProgress } from '../mixins';

// export default function <S>(params: { Render: FC<Except<DynamicArrayNode<any, S>, 'View'>> }) {
//   return function <V extends { id: string }>(options: {
//     label?: string;
//     autoFocus?: boolean;
//     childFactory: (
//       params: Pick<ScalarNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>
//     ) => O.Required<Partial<ScalarNode<V, S>>, 'View' | 'id'>;
//   }) {
//     return flow(withSkalarParent<V[], S>(), vm => {
//       const children = observable.box([
//         ...vm.value.get().map(v =>
//           options.childFactory({
//             index: 1,
//             onChange: newVal => {
//               const newArray = vm.value.get().map(curr => (v.id === curr.id ? newVal : curr));
//               vm.onChange(newArray);
//             },
//             onStoreChange: vm.onStoreChange,
//             store: vm.store,
//             value: computed(() => v)
//           })
//         )
//       ]);
//       return pipe(
//         { ...vm, children, autoFocus: options?.autoFocus ?? false },
//         withId()
//         // withMeta({ label: options?.label }),
//         // withLoading(),
//         // withProgress()
//       );
//     });
//   };
// }
