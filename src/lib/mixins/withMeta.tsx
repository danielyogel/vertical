export type Params = {
  label: string;
};

export default function withMeta(params: Params) {
  return function<VM>(vm: VM) {
    return { ...vm, label: params.label };
  };
}
