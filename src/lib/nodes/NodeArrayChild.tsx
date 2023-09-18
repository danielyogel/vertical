import { Except } from 'type-fest';
import { FC, flow, pipe } from '../utils';
import { ArrayChildNode } from '../Interfaces';
import {
  withLoading,
  withArrayChildParent,
  withProgress,
  withSelected,
  withVisibility,
  withView,
  withDisabled,
  withErrors,
  withMeta,
  withId,
  withObjectChildren
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Children } from '../mixins/withObjectChildren';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<ArrayChildNode<S, S>, 'View'>> }) {
  return function <V, C extends Children<V, S>>(options: {
    isSelected?: isSelectedParams<any, S, Except<ArrayChildNode<any, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<ArrayChildNode<any, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<ArrayChildNode<any, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<ArrayChildNode<any, S>, 'View' | 'isVisible'>>;
    label?: string | null;
    autoFocus?: boolean;
    children: C;
  }) {
    return flow(withArrayChildParent<V, S>(), vm => {
      return pipe(
        vm,
        withObjectChildren(options),
        vm => ({ autoFocus: options?.autoFocus ?? false, ...vm }),
        withId(),
        withLoading(),
        withMeta({ label: options.label }),
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
