import { observable } from 'mobx';

export default function withLoading() {
  return function<T>(obj: T) {
    return {
      ...obj,
      isLoading: observable.box(false)
    };
  };
}
