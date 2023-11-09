// import {} from '@nextui-org/react';
// import { mapValues } from '../../lib/utils';
// import { withArrayChildren, withArrayParent, withBase, withView } from '../../lib';
// import { ArrayChildren, ArrayNode } from '../../lib/Interfaces';
// import { BaseParams } from '../../lib/mixins/withBase';
// import { flow } from '../../lib/utils';

// type _node<V, S> = Pick<ArrayNode<V, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index' | 'children' | 'currentIndex'>;

// export function NodeArray<V extends Record<string, any>, S>(params: BaseParams<V, S, _node<any, S>> & { children: ArrayChildren<V, S> }) {
//   return flow(
//     withArrayParent<V, S>(),
//     vm => ({ ...vm, a: 'a' }),
//     withArrayChildren({ children: params.children }),
//     // vm => vm.,
//     withBase(params),
//     vm => vm
//     // withView(({ children, isLoading, isDisabled, errors, currentIndex }) => {
//     //   return (
//     //     <section>
//     //       <section>
//     //         {mapValues(children, (child, key) => {
//     //           return <div></div>;
//     //         })}
//     //       </section>
//     //       <section>
//     //         <b className='text-green-600'>isLoading:</b> <span> {String(isLoading.get())}</span>
//     //         <b className='text-green-600'>isDisabled:</b> <span> {String(isDisabled.get())}</span>
//     //         <b className='text-green-600'>errors:</b> <span> {JSON.stringify(errors.get())}</span>
//     //       </section>
//     //     </section>
//     //   );
//     // })
//   );
// }
