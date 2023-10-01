import { v4 as uuidv4 } from 'uuid';

export default function () {
  return function <VM>(obj: VM) {
    return {
      ...obj,
      id: uuidv4()
    };
  };
}
