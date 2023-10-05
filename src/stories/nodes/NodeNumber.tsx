import { Input } from '@nextui-org/react';
import { withBase, withSkalarParent, withView } from '../../lib';
import { AtomNode } from '../../lib/Interfaces';
import { BaseParams } from '../../lib/mixins/withBase';
import { flow } from '../../lib/utils';

type ParentVM<S> = Pick<AtomNode<number | null, S>, 'value' | 'store' | 'onStoreChange' | 'onChange' | 'index' | 'children'>;

export function NodeNumber<S>(options: BaseParams<number | null, S, ParentVM<S>>) {
  return flow(
    withSkalarParent<number | null, S>(),
    vm => ({ ...vm, children: null }),
    withBase(options),
    withView(({ value, onChange, label, errors }) => {
      const _v = value.get();
      const firstError = errors.get()[0];
      return (
        <Input
          type="number"
          value={_v === null ? '' : String(_v)}
          onValueChange={v => onChange(v === '' ? null : Number(v))}
          label={label.get()}
          errorMessage={firstError ? firstError.message : null}
        />
      );
    })
  );
}
