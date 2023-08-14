import { Except } from 'type-fest';
import { FC, flow } from '../utils';
import { ScalarNode } from '../Interfaces';
import { withView, withBase, withSkalarParent } from '../mixins';
import { BaseParams } from '../mixins/withBase';

export default function <V, S>(params: { Render: FC<Except<ScalarNode<V, S>, 'View' | 'progress'>> }) {
  type ParentParams = Pick<ScalarNode<V, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index'>;

  return function (options?: BaseParams<V, S, ParentParams & { children: null }>) {
    return flow(withSkalarParent<V, S>(), vm => ({ ...vm, children: null }), withBase(options), withView(params.Render));
  };
}
