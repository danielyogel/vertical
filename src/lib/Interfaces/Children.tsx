import { ScalarNode, Node } from '.';
import { O } from 'ts-toolbelt';

export type Children<V, S> = Partial<{
  [K in keyof V]: (params: Pick<ScalarNode<V[K], S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>) => O.Required<Partial<Node<V[K], S>>, 'View' | 'id'>;
}>;
