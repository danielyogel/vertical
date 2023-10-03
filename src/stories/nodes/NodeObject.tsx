import {} from '@nextui-org/react';
import { withBase, withObjectChildren, withSkalarParent, withView } from '../../lib';
import { AtomNode, Children, ObjectNode, ScalarNode } from '../../lib/Interfaces';
import { BaseParams } from '../../lib/mixins/withBase';
import { flow } from '../../lib/utils';

type _ObjectNode<V, S> = Pick<ObjectNode<V, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index' | 'children'>;

type Params<V extends Record<string, any>, S> = BaseParams<V, S, _ObjectNode<V, S>> & { children: Children<V, S> };

export function NodeObject<V extends Record<string, any>, S>(params: Params<V, S>) {
  return flow(
    withSkalarParent<V, S>(),
    withObjectChildren({ children: params.children }),
    withBase(params),
    withView(({ value, onChange, children, errors }) => {
      const hasError = Boolean(errors.get().length);

      return (
        <section className="flex" style={{ backgroundColor: hasError ? 'red' : 'green', margin: '30px' }}>
          {Object.entries(children).map(([_, node]) => {
            return <node.View key={node.id} />;
          })}
        </section>
      );
    })
  );
}
