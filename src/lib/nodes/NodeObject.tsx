import { computed } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../utils';
import { ObjectNode, ScalarNode, Node } from '../Interfaces';
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
  withRecordParent,
  withObjectChildren
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Children } from '../mixins/withObjectChildren';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<ObjectNode<any, S>, 'View'>> }) {
  return function <V extends Record<string, any>, C extends Children<V, S>>(options: {
    isSelected?: isSelectedParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible'>>;
    label?: string | null;
    autoFocus?: boolean;
    children: C;
  }) {
    return flow(withRecordParent<V, S>(), vm => {
      return pipe(
        vm,
        withObjectChildren({ children: options.children }),
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
