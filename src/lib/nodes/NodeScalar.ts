import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors, withMeta } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';

export default function<V, S>(params: { Render: FC<Except<BaseNode<V, S>, 'View'>> }) {
  type Options = {
    isSelected?: isSelectedParams<V, S, Except<BaseNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<V, S, Except<BaseNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
  } & VisibilityParams<V, S> &
    DisabledParams<V, S> &
    DisabledParams<V, S> &
    MetaParams;

  return function(options: Options) {
    return flow(withParent<V, S, { index: string }>(), vm => {
      return pipe(
        { ...vm, children: null },
        withMeta(options),
        withLoading(),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options),
        withVisibility(options),
        withView(params.Render)
      );
    });
  };
}
