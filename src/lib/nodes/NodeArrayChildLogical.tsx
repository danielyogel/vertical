import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../utils';
import { ArrayChildNode, Node, ArrayProps } from '../Interfaces';
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
  withObjectLogicalChildren
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Children } from '../mixins/withObjectLogicalChildren';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<ArrayChildNode<S, S>, 'View'>> }) {
  return function <V extends Record<string, any>, C extends Children<V, S>>(options: {
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
        withId(),
        vm => ({ ...vm, autoFocus: options?.autoFocus ?? false }),
        withObjectLogicalChildren(options),
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
