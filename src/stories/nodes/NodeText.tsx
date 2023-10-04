import { Input } from '@nextui-org/react';
import { withBase, withSkalarParent, withView } from '../../lib';
import { AtomNode } from '../../lib/Interfaces';
import { BaseParams } from '../../lib/mixins/withBase';
import { flow } from '../../lib/utils';

type ParentVM<S> = Pick<AtomNode<string | null, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index' | 'children'>;

export function NodeText<S>(options: BaseParams<string | null, S, ParentVM<S>>) {
  return flow(
    withSkalarParent<string | null, S>(),
    vm => ({ ...vm, children: null }),
    withBase(options),
    withView(({ value, onChange, label, errors }) => {
      const _v = value.get();
      return <Input value={_v === null ? undefined : _v} onValueChange={onChange} label={label.get()} errorMessage={errors.get().length ? 'zz' : null} />;
    })
  );
}
