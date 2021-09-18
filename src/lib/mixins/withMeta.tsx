import { computed } from 'mobx';
import { startCase } from '../../utils';
import { Node } from '../Interfaces';

type PreviusVM<V, S, R> = Pick<Node<V, S, R>, 'value' | 'store' | 'index'>;

export type Params = {
  label?: string | null;
};

export default function withMeta(params?: Params) {
  return function <V, S, R, VM extends PreviusVM<V, S, R>>(vm: VM) {
    const { index } = vm;
    return {
      ...vm,
      label: computed(() =>
        params?.label === undefined ? (index !== null ? startCase(String(index)) : '') : params.label === null ? '' : params.label
      )
    };
  };
}
