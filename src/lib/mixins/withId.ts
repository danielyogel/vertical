export default function () {
  return function <VM>(obj: VM) {
    return {
      ...obj,
      id: crypto.randomUUID()
    };
  };
}
