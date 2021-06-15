import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { Params as ErrorParams } from '../mixins/withErrors';

export default function<S, O>(params: {
  Render: FC<Except<BaseNode<any, S, O>, 'View'> & { items: Array<{ key: string | null; label?: string }> }>;
}) {
  return function<K extends string | null>(
    options: OptionsParams<O> &
      SelectedParams<S> &
      VisibilityParams<S> &
      DisabledParams<K, S, O> &
      DisabledParams<K, S, O> &
      ErrorParams<K, S, O> & { items: Array<{ key: K; label?: string }> }
  ) {
    return flow(withParent<K, S>(), vm => {
      return pipe(
        { ...vm, children: null, items: options.items },
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
