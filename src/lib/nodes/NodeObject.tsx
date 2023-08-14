import { computed } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../utils';
import { ObjectNode, ScalarNode, Node } from '../Interfaces';
import { withLoading, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors, withMeta, withId, withRecordParent } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<ObjectNode<any, S>, 'View'>> }) {
  return function <V extends Record<string, any>, OV extends V>(options: {
    isSelected?: isSelectedParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<V, S, Except<ObjectNode<V, S>, 'View' | 'isVisible'>>;
    label?: string | null;
    autoFocus?: boolean;
    children: Partial<{
      [K in keyof OV]: (
        params: Pick<ScalarNode<OV[K], S>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>
      ) => O.Required<Partial<Node<OV[K], S>>, 'View' | 'id'>;
    }>;
  }) {
    return flow(withRecordParent<V, S>(), vm => {
      return pipe(
        vm,
        withId(),
        vm => ({
          ...vm,
          autoFocus: options?.autoFocus ?? false,
          children: pipe(
            keys(options.children),
            map(key => {
              const instance = (options.children[key] as any)({
                ...vm,
                value: computed(() => vm.value.get()[key]) as any,
                onChange: (val: any) => vm.onChange({ ...vm.value.get(), [key]: val }) as any,
                index: key
              });

              return [key, instance] as const;
            }),
            e => Object.fromEntries(e)
          )
        }),
        withLoading(),
        withMeta({ label: options.label }),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options.isDisabled),
        withVisibility(options.isVisible),
        withView(params.Render)
      );
    });
  };
}
