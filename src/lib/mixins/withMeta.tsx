import { computed } from 'mobx';
import { startCase } from '../../utils';
import { Node } from '../Interfaces';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'index'>;

export type Params = {
  label?: string | null;
};

export default function withMeta(params?: Params) {
  return function <V, S, VM extends PreviusVM<V, S>>(vm: VM) {
    const { index } = vm;
    return {
      ...vm,
      label: computed(() =>
        params?.label === undefined ? (index !== null ? startCase(String(index)) : '') : params.label === null ? '' : params.label
      )
    };
  };
}
