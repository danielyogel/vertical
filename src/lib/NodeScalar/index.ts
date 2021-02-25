import { FC, flow } from '../../utils';
import { BaseNode } from '../BaseNode';
import { withLoading, withOptions, withParent, withProgress, withView, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';

export default function<V, S, O>(params: { Render: FC<BaseNode<V, S, O>> }) {
  return function(options: O & SelectedParams<S> & VisibilityParams<S>) {
    return flow(
      withParent<V, S>(),
      withOptions(options),
      withLoading(),
      withProgress(),
      withSelected(options),
      withVisibility(options),
      withView(params.Render)
    );
  };
}
