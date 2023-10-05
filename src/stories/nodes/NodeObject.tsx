import {} from '@nextui-org/react';
import { withBase, withObjectChildren, withSkalarParent, withView } from '../../lib';
import { Children, ObjectNode } from '../../lib/Interfaces';
import { BaseParams } from '../../lib/mixins/withBase';
import { flow } from '../../lib/utils';

type _node<V, S> = Pick<ObjectNode<V, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index' | 'children'>;

export function NodeObject<V extends Record<string, any>, S>(params: BaseParams<V, S, _node<V, S>> & { children: Children<V, S> }) {
  return flow(
    withSkalarParent<V, S>(),
    withObjectChildren({ children: params.children }),
    withBase(params),
    withView(({ children, errors }) => {
      const hasError = Boolean(errors.get().length);

      return (
        <section className='p-3 border-2 rounded' style={{ borderColor: hasError ? 'red' : 'lightgray' }}>
          {Object.entries(children).map(([_, node]) => {
            return (
              <div key={node.id} className='mb-2'>
                <node.View />
              </div>
            );
          })}
        </section>
      );
    })
  );
}
