import { Except } from 'type-fest';
import { FC, flow, pipe } from '../utils';
import { Children, DynamicArrayChildNode } from '../Interfaces';
import {
  withLoading,
  withProgress,
  withSelected,
  withVisibility,
  withView,
  withDisabled,
  withErrors,
  withMeta,
  withId,
  withDynamicChildParent,
  withNavigation,
  withObjectChildren
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<DynamicArrayChildNode<any, S>, 'View'>> }) {
  return function <V extends Record<string, any>, OV extends V>(options: {
    isSelected?: isSelectedParams<V, S, Except<DynamicArrayChildNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled' | 'Navigation'>>;
    errors?: errorsParams<V, S, Except<DynamicArrayChildNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled' | 'Navigation'>>;
    isDisabled?: isDisabledParams<V, S, Except<DynamicArrayChildNode<V, S>, 'View' | 'isVisible' | 'isDisabled' | 'Navigation'>>;
    isVisible?: isVisibleParams<V, S, Except<DynamicArrayChildNode<V, S>, 'View' | 'isVisible' | 'Navigation'>>;
    label?: string | null;
    nav?: FC<Except<DynamicArrayChildNode<V, S>, 'View' | 'Navigation'>>;
    autoFocus?: boolean;
    children: Children<OV, S>;
  }) {
    return flow(withDynamicChildParent<V, S>(), vm => {
      return pipe(
        vm,
        withId(),
        withObjectChildren({ children: options.children }),
        vm => ({ autoFocus: options?.autoFocus ?? false, ...vm }),
        withLoading(),
        withMeta({ label: options.label }),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options.isDisabled),
        withVisibility(options.isVisible),
        withNavigation(options.nav),
        withView(params.Render)
      );
    });
  };
}
