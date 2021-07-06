import { computed } from 'mobx';
import { startCase } from '../../utils';
import { Node } from '../Interfaces';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store'> & { index: string | number | null };

export type Params = {
  label?: string;
};

export default function withMeta(params?: Params) {
  return function <V, S, VM extends PreviusVM<V, S>>(vm: VM) {
    const { index } = vm;
    return { ...vm, label: computed(() => params?.label || (index !== null ? startCase(String(index)) : '')) };
  };
}
