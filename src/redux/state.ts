export type State = {
  test: number
  firstName: string
  lastName: string
}

export const getInitialState = (): State => ({
  test: 123,
  firstName: 'Abc',
  lastName: '',
})
