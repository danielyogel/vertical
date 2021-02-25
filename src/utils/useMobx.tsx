import { observable, action } from 'mobx';
import { useState } from 'react';

export default function useMobx<T>(initialValue: T) {
  const [store] = useState(observable.box({ ...initialValue }));

  const get = store.get.bind(store);
  const set = action(store.set.bind(store));

  return { get, set };
}
