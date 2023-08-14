import { computed } from 'mobx';
import { startCase } from '../utils';
import { Node } from '../Interfaces';

type PreviusVM<V, S> = Pick<Node<V, S>, 'value' | 'store' | 'index'>;

export type Params = {
  label?: string | null;
  placeholder?: string | null | ((node: { index: string | number; label: string }) => string);
};

export default function withMeta(params?: Params) {
  return function <V, S, VM extends PreviusVM<V, S>>(vm: VM) {
    const { index } = vm;

    const _label = computed(() => {
      return params?.label === undefined ? (index !== null ? startCase(String(index)) : '') : params.label === null ? '' : params.label;
    });

    const _placeholder = computed(() => {
      return params?.placeholder === undefined
        ? index !== null
          ? startCase(String(index))
          : ''
        : params.placeholder === null
        ? ''
        : typeof params.placeholder === 'function'
        ? params.placeholder({ index: vm.index, label: _label.get() })
        : params.placeholder;
    });

    return {
      ...vm,
      placeholder: _placeholder,
      label: _label
    };
  };
}
