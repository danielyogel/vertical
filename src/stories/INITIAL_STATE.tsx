export const INITIAL_STATE = {
  name: 'John Doe' as string | null,
  gender: null as null | 'male' | 'female',
  lastName: '' as string | null,
  phone: 323223 as number | null,
  id: 2 as number | null,
  age: 324 as number | null,
  country: 'israel' as string | null,
  birthday: 23 as number | null,
  birthdayz: 23 as number | null,
  locations: [
    { province: 'Tel Aviv' as string | null, state: 'TA' as string | null },
    { province: 'Jerusalem' as string | null, state: 'JLM' as string | null }
  ]
};
