import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { Params as ErrorParams } from '../mixins/withErrors';

export default function<V, S, O>(params: { Render: FC<Except<BaseNode<V, S, O>, 'View'>> }) {
  return function(
    options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & DisabledParams<V, S, O> & DisabledParams<V, S, O> & ErrorParams<V, S, O>
  ) {
    return flow(withParent<V, S>(), vm => {
      return pipe(
        { ...vm, children: null },
        withLoading(),
        withOptions(options),
        withProgress(),
        withSelected(options),
        withErrors(options),
        withDisabled(options),
        withVisibility(options),
        withView(params.Render)
      );
    });
  };
}
