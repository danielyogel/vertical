import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../../utils';
import { RecordNode, Node, ArrayProps } from '../Interfaces';
import {
  withLoading,
  withArrayChildParent,
  withProgress,
  withSelected,
  withVisibility,
  withView,
  withDisabled,
  withErrors,
  withMeta,
  withId
} from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { isVisible as isVisibleParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { context as contextParams } from '../mixins/withContext';

export default function <S extends Record<string, any>>(params: { Render: FC<Except<RecordNode<S, S, any>, 'View'>> }) {
  return function <R>(options: {
    context?: contextParams<any, S, Except<RecordNode<S, S, any>, 'View' | 'isVisible'>, R>;
    isSelected?: isSelectedParams<any, S, Except<RecordNode<any, S, R>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<RecordNode<any, S, R>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<RecordNode<any, S, R>, 'View' | 'isVisible' | 'isDisabled'>>;
    isVisible?: isVisibleParams<any, S, Except<RecordNode<any, S, R>, 'View' | 'isVisible'>>;
    label?: string;
    autoFocus?: boolean;
    children: {
      [key: string]: (
        params: Pick<RecordNode<S, S, R>, 'onChange' | 'onStoreChange' | 'store' | 'value' | 'index' | keyof ArrayProps>
      ) => O.Required<Partial<Node<Partial<S>, S, any>>, 'View' | 'id'>;
    };
  }) {
    return flow(withArrayChildParent<S, S, any>(), vm => {
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
                value: vm.value,
                onChange: vm.onChange,
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
