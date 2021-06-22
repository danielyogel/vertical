import { Except } from 'type-fest';
import { FC, flow, pipe } from '../../utils';
import { BaseNode } from '../Interfaces';
import { withLoading, withParent, withProgress, withView, withSelected, withVisibility, withDisabled, withErrors, withMeta } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export default function<V, S>(params: { Render: FC<Except<BaseNode<V, S>, 'View'>> }) {
  type Options = {
    isSelected?: isSelectedParams<V, S, Except<BaseNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<V, S, Except<BaseNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<V, S, Except<BaseNode<V, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<V, S, Except<BaseNode<V, S>, 'View' | 'isVisible'>>;
    label?: string;
  };

  return function(options?: Options) {
    return flow(withParent<V, S, { index: string }>(), vm => {
      return pipe(
        { ...vm, children: null },
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
