import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors, withMeta } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { Params as ErrorParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';

export default function<V, S>(params: { Render: FC<Except<BaseNode<V, S>, 'View'>> }) {
  return function(
    options: SelectedParams<V, S> & VisibilityParams<V, S> & DisabledParams<V, S> & DisabledParams<V, S> & ErrorParams<V, S> & MetaParams
  ) {
    return flow(withParent<V, S>(), vm => {
      return pipe(
        { ...vm, children: null },
        withMeta(options),
        withLoading(),
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
