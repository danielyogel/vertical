import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { ArrayNode } from '../Interfaces';
import {
  withLoading,
  withArrayParent,
  withProgress,
  withSelected,
  withVisibility,
  withView,
  withDisabled,
  withErrors,
  withMeta,
  withId,
  withArrayChildren,
  WithArrayChildrenOptions
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export default function <S>(params: { Render: FC<Except<ArrayNode<any, S>, 'View'>> }) {
  return function <V>(
    options: {
      isSelected?: isSelectedParams<any, S, Except<ArrayNode<any, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
      errors?: errorsParams<any, S, Except<ArrayNode<any, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
      isDisabled?: isDisabledParams<any, S, Except<ArrayNode<any, S>, 'View' | 'isVisible' | 'isDisabled'>>;
      isVisible?: isVisibleParams<any, S, Except<ArrayNode<any, S>, 'View' | 'isVisible'>>;
      autoFocus?: boolean;
      label?: string | null;
    } & WithArrayChildrenOptions<V, S>
  ) {
    return flow(withArrayParent<V, S>(), vm => {
      return pipe(
        vm,
        withId(),
        withArrayChildren({ children: options.children }),
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
