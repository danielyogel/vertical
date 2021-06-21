import { computed } from 'mobx';
import { startCase } from '../../utils';

export type Params = {
  label?: string;
};

export default function withMeta(params: Params) {
  return function<VM extends { index: string | number | null }>(vm: VM) {
    const { index } = vm;
    return { ...vm, label: computed(() => params.label || (index !== null ? startCase(String(index)) : '')) };
  };
}
