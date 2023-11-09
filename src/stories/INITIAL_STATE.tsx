import { observable } from 'mobx';

export const INITIAL_STATE = {
  name: 'John Doe' as string | null,
  gender: null as null | 'male' | 'female',
  lastName: '' as string | null,
  details: {
    future: '' as string | null,
    past: '' as string | null,
    locations: [{ id: 'J', province: 'Jerusalem' as string | null, postalCode: null as number | null, isCapital: 'yes' as 'yes' | 'no' | null }]
  },
  phone: 323223 as number | null,
  id: 2 as number | null,
  age: 324 as number | null,
  country: 'israel' as string | null,
  birthday: 23 as number | null,
  birthdayz: 23 as number | null,
  locations: [{ id: 'J', province: 'Jerusalem' as string | null, postalCode: null as number | null, isCapital: 'yes' as 'yes' | 'no' | null }]
};

export const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);
