import { computed, IComputedValue } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../../utils';
import { DynamicArrayChildNode, ScalarNode } from '../Interfaces';
import {
  withLoading,
  withProgress,
  withSelected,
  withVisibility,
  withView,
  withDisabled,
  withErrors,
  withMeta,
  withId,
  withDynamicChildParent
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { context as contextParams } from '../mixins/withContext';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<DynamicArrayChildNode<any, S, any>, 'View'>> }) {
  return function <V, R>(options: {
    context?: contextParams<any, S, Except<DynamicArrayChildNode<S, S, any>, 'View' | 'isVisible'>, R>;
    isSelected?: isSelectedParams<any, S, Except<DynamicArrayChildNode<any, S, R>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<DynamicArrayChildNode<any, S, R>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<DynamicArrayChildNode<any, S, R>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<DynamicArrayChildNode<any, S, R>, 'View' | 'isVisible'>>;
    label?: string;
    autoFocus?: boolean;
    children: Partial<
      {
        [K in keyof V]: (
          params: Pick<ScalarNode<V[K], S, R>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index'>
        ) => O.Required<Partial<ScalarNode<V[K], S, any>>, 'View' | 'id'>;
      }
    >;
  }) {
    return flow(withDynamicChildParent<V, S, any>(), vm => {
      return pipe(
        vm,
        withId(),
        vm => ({
          ...vm,
          autoFocus: options?.autoFocus ?? false,
          children: pipe(
            keys(options.children),
            map(key => {
              const instance = (options.children[key as keyof V] as any)({
                ...vm,
                value: computed(() => vm.value.get()[key as keyof V]) as any,
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

// Utils...
type NodeInfer<F> = F extends (args: infer V) => any ? (V extends { value: IComputedValue<infer Z> } ? Z : never) : never;

export type GetVal<T extends Record<string, any>> = {
  [K in keyof T]: NodeInfer<T[K]>;
};
