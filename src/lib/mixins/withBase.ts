import { pipe } from '../../utils/functionalProgramming';
import { ArrayChildNode, Node } from '../Interfaces';
import withMeta, { Params as MetaParams } from './withMeta';
import withId from './withId';
import withLoading from './withLoading';
import withErrors, { errors as ErrorsParams } from './withErrors';
import withDisabled, { isDisabled } from './withDisabled';

type Params<V, S, VM extends Pick<Node<V, S>, 'value' | 'store' | 'index' | 'children'>> = MetaParams & {
  errors: ErrorsParams<V, S, VM & Pick<Node<V, S>, 'id' | 'label' | 'placeholder' | 'isLoading' | 'setLoading'>>;
  isDisabled?: isDisabled<V, S, VM & Pick<Node<V, S>, 'id' | 'label' | 'placeholder' | 'isLoading' | 'setLoading' | 'errors'>>;
};

export default function withBase<V, S, VM extends Pick<Node<V, S>, 'value' | 'store' | 'index' | 'children'>>(params?: Params<V, S, VM>) {
  return function (vm: VM) {
    return pipe(vm, withId(), withMeta(params), withLoading(), withErrors(params?.errors), withDisabled(params?.isDisabled));
  };
}
