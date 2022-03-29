import { computed, observable } from 'mobx';
import { expect, test } from 'vitest';
import withBase from './withBase';

test('withBase', () => {
  const store = observable.box({ name: 'john' });

  const INITIAL_VM = { children: null, index: 1, store: computed(() => store.get()), value: computed(() => 1) };

  const RESULT = withBase()(INITIAL_VM);

  expect(RESULT.errors).toBeDefined();
  expect(RESULT.isLoading).toBeDefined();
  expect(RESULT.setLoading).toBeDefined();
  expect(RESULT.label).toBeDefined();
  expect(RESULT.placeholder).toBeDefined();
  expect(RESULT.id).toBeDefined();
});
