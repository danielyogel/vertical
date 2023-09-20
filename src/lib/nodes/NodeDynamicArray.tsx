import { Except } from 'type-fest';
import { FC, flow, pipe } from '../utils';
import { DynamicArrayNode } from '../Interfaces';
import { withLoading, withMeta, withId, withSkalarParent, withProgress, withSelected, withView, withNavigation, withDynamicArrayChildren } from '../mixins';
import { Params as ChildrenParams } from '../mixins/withDynamicArrayChildren';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import withVisibility, { isVisible as isVisibleParams } from '../mixins/withVisibility';
import withDisabled, { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import withErrors, { errors as errorsParams } from '../mixins/withErrors';

export default function <S>(params: { Render: FC<Except<DynamicArrayNode<any, S>, 'View'>> }) {
  type Params<V extends { id: string }> = {
    isSelected?: isSelectedParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled' | 'Navigation'>>;
    errors?: errorsParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled' | 'Navigation'>>;
    isDisabled?: isDisabledParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'isDisabled' | 'Navigation'>>;
    isVisible?: isVisibleParams<any, S, Except<DynamicArrayNode<V, S>, 'View' | 'isVisible' | 'Navigation'>>;
    autoFocus?: boolean;
    label?: string | null;
    nav?: FC<Except<DynamicArrayNode<V, S>, 'View' | 'Navigation'>>;
    child: ChildrenParams<V, S>['child'];
    childEdit?: ChildrenParams<V, S>['childEdit'];
    defaultValue: ChildrenParams<V, S>['defaultValue'];
    selectedId?: ChildrenParams<V, S>['selectedId'];
  };

  return function <V extends { id: string }>(options: Params<V>) {
    return flow(withSkalarParent<V[], S>(), vm => {
      return pipe(
        vm,
        withId(),
        withDynamicArrayChildren(options),
        vm => ({ autoFocus: options?.autoFocus ?? false, ...vm }),
        withMeta({ label: options.label }),
        withLoading(),
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
