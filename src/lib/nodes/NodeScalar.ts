import { FC, flow } from '../../utils';
import { BaseNodeNoView } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withView, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';

export default function<V, S, O>(params: { Render: FC<BaseNodeNoView<V, S, O>> }) {
  return function(options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S>) {
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
