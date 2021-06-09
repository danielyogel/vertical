import { computed } from 'mobx';
import { FC, flow, map, pipe } from '../../utils';
import { RecordBaseNodeNoView, BaseNodeNoView, NodeFn } from '../interfaces/BaseNode';
import { GetObjectVal } from '../interfaces/GetVaueTypes';
import { withLoading, withOptions, withParent, withProgress, withViewRecord, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';

export default function<K extends string, S, O, P = {}>(params: { Render: FC<RecordBaseNodeNoView<any, S, O, K, P>> }) {
  return function<Keys extends K>(
    options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & { children: Record<Keys, NodeFn<BaseNodeNoView<any, S, any, O>>> }
  ) {
    return flow(
      withParent<GetObjectVal<typeof options.children>, S, P>(),
      withOptions(options),
      withLoading(),
      withProgress(),
      withSelected(options),
      withVisibility(options),
      vm => {
        const children = pipe(
          options.children,
          Object.keys,
          map(key => {
            const k = key as keyof typeof options.children;
            const instance = options.children[k]({
              ...vm,
              value: computed(() => vm.value.get()[k]) as any,
              onChange: val => vm.onChange({ ...vm.value.get(), [key]: val }) as any,
              parentOptios: vm.options
            });

            return [key, instance];
          }),
          entries => Object.fromEntries(entries)
        );
        return { ...vm, children };
      },
      withViewRecord(params.Render)
    );
  };
}
