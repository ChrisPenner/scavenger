/* @flow */
import R from 'ramda'
export const phoneNumber: (n: string) => string = R.compose(
  R.replace(/[^-+0-9\s()]/g, ''),
  R.defaultTo('')
)
