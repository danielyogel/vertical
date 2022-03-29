import { Except } from 'type-fest';
import { FC, flow } from '../../utils';
import { ScalarNode } from '../Interfaces';
import { withView, withBase } from '../mixins';
import { BaseParams } from '../mixins/withBase';

export default function <V, S>(params: { Render: FC<Except<ScalarNode<V, S>, 'View' | 'progress'>> }) {
  type ParentParams = Pick<ScalarNode<V, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index'>;

  return function (options?: BaseParams<V, S, ParentParams & { children: null }>) {
    return flow(
      (vm: ParentParams) => vm,
      vm => ({ ...vm, children: null }),
      withBase(options),
      withView(params.Render)
    );
  };
}
