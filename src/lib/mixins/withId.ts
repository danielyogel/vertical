import { nanoid } from 'nanoid';

export default function () {
  return function <VM>(obj: VM) {
    return {
      ...obj,
      id: nanoid()
    };
  };
}
