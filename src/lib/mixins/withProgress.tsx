import { observable } from 'mobx';

export default function withProgress() {
  return function<T>(obj: T) {
    return {
      ...obj,
      progress: observable.box(0)
    };
  };
}
