import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors, withMeta } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { Params as ErrorParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';

export default function<S>(params: { Render: FC<Except<BaseNode<any, S>, 'View'> & { items: Array<{ key: string | null; label?: string }> }> }) {
  return function<K extends string | null>(
    options: SelectedParams<S> &
      VisibilityParams<S> &
      DisabledParams<K, S> &
      DisabledParams<K, S> &
      ErrorParams<K, S> & { items: Array<{ key: K; label?: string }> } & MetaParams
  ) {
    return flow(withParent<K, S>(), vm => {
      return pipe(
        { ...vm, children: null, items: options.items },
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
