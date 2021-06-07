export type Params<O> = {
  options: O;
};

export default function withOptions<O>(options: Params<O>) {
  return function<T>(obj: T) {
    return {
      ...obj,
      options: options.options
    };
  };
}
