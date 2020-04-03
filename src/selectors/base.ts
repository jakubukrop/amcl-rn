import {State} from '../redux/state'

export const firstNameSelector = (state: State): string => state.firstName

export const lastNameSelector = (state: State): string => state.lastName
