import { configure } from 'mobx';

export * from './mixins';
export * from './init';

configure({ enforceActions: 'never' });
