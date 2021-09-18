import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { ScalarNode } from '../Interfaces';
import {
  withLoading,
  withProgress,
  withView,
  withSelected,
  withVisibility,
  withDisabled,
  withErrors,
  withMeta,
  withId,
  withSkalarParent
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { context as contextParams } from '../mixins/withContext';

type Items<K = string | null> = { items: { key: K; label?: string }[] };

export default function <S>(params: { Render: FC<Except<ScalarNode<any, S, any>, 'View'> & Items> }) {
  type Options<K extends string | null, R> = {
    context?: contextParams<any, S, Except<ScalarNode<S, S, any>, 'View' | 'isVisible'>, R>;
    isSelected?: isSelectedParams<K, S, Except<ScalarNode<K, S, R>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'> & Items<K>>;
    errors?: errorsParams<K, S, Except<ScalarNode<K, S, R>, 'View' | 'isVisible' | 'errors' | 'isDisabled'> & Items<K>>;
    isDisabled?: isDisabledParams<K, S, Except<ScalarNode<K, S, R>, 'View' | 'isVisible' | 'isDisabled'> & Items<K>>;
    isVisible?: isVisibleParams<K, S, Except<ScalarNode<K, S, R>, 'View' | 'isVisible'> & Items<K>>;
    label?: string;
    autoFocus?: boolean;
    items: { key: K; label?: string }[];
  } & Items<K>;

  return function <K extends string | null, R>(options: Options<K, R>) {
    return flow(withSkalarParent<K, S, any>(), vm => {
      return pipe(
        { ...vm, children: null, items: options.items, autoFocus: options?.autoFocus ?? false },
        withId(),
        withMeta({ label: options.label }),
        withLoading(),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options.isDisabled),
        withVisibility(options.isVisible),
        withView(params.Render)
      );
    });
  };
}
