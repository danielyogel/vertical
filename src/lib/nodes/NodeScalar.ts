import { Except } from 'type-fest';
import { FC, flow } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withView, withSelected, withVisibility, withDisabled } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Params as DisabledParams } from '../mixins/withDisabled';

export default function<V, S, O>(params: { Render: FC<Except<BaseNode<V, S, O>, 'View'>> }) {
  return function(options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & DisabledParams<V, S, O>) {
    return flow(
      withParent<V, S>(),
      vm => ({ ...vm, children: null }), // Hack for resloving type issues further away
      withLoading(),
      withOptions(options),
      withProgress(),
      withSelected(options),
      withDisabled(options),
      withVisibility(options),
      withView(params.Render)
    );
  };
}
