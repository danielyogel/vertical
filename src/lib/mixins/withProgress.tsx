import { observable } from 'mobx';

export default function withProgress() {
  return function <VM>(obj: VM) {
    return {
      ...obj,
      progress: observable.box(0)
    };
  };
}
