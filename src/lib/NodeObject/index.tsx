import { FC, flow } from '../../utils';
import { RecordBaseNode, NodeFn } from '../BaseNode';
import { GetVal } from '../GetVaueTypes';
import { withLoading, withOptions, withParent, withProgress, withViewRecord, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import bindChildrenToParams from './bindChildrenToParams';

export default function<K extends string, S, O>(params: { Render: FC<RecordBaseNode<any, S, O, K>> }) {
  return function<C extends Record<K, NodeFn>>(options: O & SelectedParams<S> & VisibilityParams<S> & { children: C }) {
    return flow(
      withParent<GetVal<C>, S>(),
      withOptions(options),
      withLoading(),
      withProgress(),
      withSelected(options),
      withVisibility(options),
      vm => {
        return { ...vm, children: bindChildrenToParams(vm) };
      },
      withViewRecord(params.Render)
    );
  };
}
