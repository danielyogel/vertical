export default function withOptions<O>(options: O) {
  return function<T>(obj: T) {
    return {
      ...options,
      ...obj
    };
  };
}
