import { computed } from 'mobx';
import { pipe } from '../../utils/functionalProgramming';
import { Node } from '../Interfaces';
import { withMeta, withLoading } from '.';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'isLoading' | 'errors' | 'index'>;

export type isDisabled<V, S, VM extends PreviusVM<V, S>> = (vm: VM) => boolean;

export default function withDisabled<V, S, VM extends PreviusVM<V, S>>(isDisabled?: isDisabled<V, S, VM>) {
  return function (vm: VM) {
    return pipe(vm, withMeta());
  };
}
