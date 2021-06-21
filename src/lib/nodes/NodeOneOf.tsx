import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors, withMeta } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';

type Items<K = string | null> = { items: { key: K; label?: string }[] };

export default function<S>(params: { Render: FC<Except<BaseNode<any, S>, 'View'> & Items> }) {
  type Options<K extends string | null> = {
    isSelected?: isSelectedParams<K, S, Except<BaseNode<K, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'> & Items<K>>;
    errors?: errorsParams<K, S, Except<BaseNode<K, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'> & Items<K>>;
  } & VisibilityParams<K, S> &
    DisabledParams<K, S> &
    DisabledParams<K, S> &
    Items<K> &
    MetaParams;

  return function<K extends string | null>(options: Options<K>) {
    return flow(withParent<K, S, { index: string }>(), vm => {
      return pipe(
        { ...vm, children: null, items: options.items },
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
