import { ScalarNode, Node } from '.';
import { O } from 'ts-toolbelt';

export type Children<V extends Record<string, any>, S extends Record<string, any>> = Partial<{
  [K in keyof V]: (params: Pick<ScalarNode<V[K], S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>) => O.Required<Partial<Node<V[K], S>>, 'View' | 'id'>;
}>;
