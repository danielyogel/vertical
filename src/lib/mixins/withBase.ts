import { pipe } from '../../utils/functionalProgramming';
import { ArrayChildNode, Node } from '../Interfaces';
import withMeta, { Params as MetaParams } from './withMeta';
import withId from './withId';
import withLoading from './withLoading';
import withErrors, { errors as ErrorsParams } from './withErrors';
import withDisabled, { isDisabled } from './withDisabled';
import withVisibility, { isVisible } from './withVisibility';
import withSelected, { isSelected } from './withSelected';

export type BaseParams<V, S, VM extends Pick<Node<V, S>, 'value' | 'store' | 'index' | 'children'>> = MetaParams & {
  autoFocus?: boolean;
  errors?: ErrorsParams<V, S, VM & Pick<Node<V, S>, 'id' | 'label' | 'placeholder' | 'isLoading' | 'setLoading' | 'autoFocus'>>;
  isDisabled?: isDisabled<V, S, VM & Pick<Node<V, S>, 'id' | 'label' | 'placeholder' | 'isLoading' | 'setLoading' | 'errors' | 'autoFocus'>>;
  isSelected?: isSelected<
    V,
    S,
    VM & Pick<Node<V, S>, 'id' | 'label' | 'placeholder' | 'isLoading' | 'setLoading' | 'errors' | 'isDisabled' | 'autoFocus'>
  >;
  isVisible?: isVisible<
    V,
    S,
    VM & Pick<Node<V, S>, 'id' | 'label' | 'placeholder' | 'isLoading' | 'setLoading' | 'errors' | 'isDisabled' | 'isSelected' | 'autoFocus'>
  >;
};

export default function withBase<V, S, VM extends Pick<Node<V, S>, 'value' | 'store' | 'onStoreChange' | 'index' | 'children'>>(
  params?: BaseParams<V, S, VM>
) {
  return function (vm: VM) {
    return pipe(
      vm,
      vm => ({ ...vm, autoFocus: params?.autoFocus ?? false }),
      withId(),
      withMeta(params),
      withLoading(),
      withErrors(params?.errors),
      withDisabled(params?.isDisabled),
      withSelected(),
      withVisibility(params?.isVisible)
    );
  };
}
