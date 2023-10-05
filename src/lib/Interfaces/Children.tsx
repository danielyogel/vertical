import { ScalarNode, Node, ArrayChildNode, ArrayProps } from '.';
import { O } from 'ts-toolbelt';

export type Children<V, S> = Partial<{
  [K in keyof V]: (
    params: Pick<ScalarNode<V[K], S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>
  ) => O.Required<Partial<Node<V[K], S>>, 'View' | 'id'>;
}>;

export type ArrayChildren<V, S> = ReadonlyArray<
  (
    parent: Pick<ArrayChildNode<V, S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | keyof ArrayProps>
  ) => O.Required<Partial<Node<Partial<V>, S>>, 'View' | 'id'>
>;
