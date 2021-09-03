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
  withSkalarParent,
  withId
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export default function <V, S>(params: { Render: FC<Except<ScalarNode<V, S>, 'View'>> }) {
  type Options = {
    isSelected?: isSelectedParams<V, S, Except<ScalarNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<V, S, Except<ScalarNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<V, S, Except<ScalarNode<V, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<V, S, Except<ScalarNode<V, S>, 'View' | 'isVisible'>>;
    label?: string | null;
    autoFocus?: boolean;
  };

  return function (options?: Options) {
    return flow(withSkalarParent<V, S>(), vm => {
      return pipe(
        { ...vm, children: null, autoFocus: options?.autoFocus ?? false },
        withId(),
        withMeta({ label: options?.label }),
        withLoading(),
        withProgress(),
        withSelected(options?.isSelected),
        withErrors(options?.errors),
        withDisabled(options?.isDisabled),
        withVisibility(options?.isVisible),
        withView(params.Render)
      );
    });
  };
}
