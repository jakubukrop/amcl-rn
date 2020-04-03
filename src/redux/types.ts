import {State} from './state'

type PathElement = number | string
export type Path = Array<PathElement>

export type GenericAction<Segment, Payload = {}> = {
  type: string
  path?: Path
  payload?: Payload
  reducer: Reducer<Segment, Payload>
  doNotLog?: boolean
}

export type Reducer<Segment, Payload> = (
  state: Segment,
  payload: Payload,
) => Segment

export type GetState = () => State

export type Dispatch = <Result>(
  action: GenericAction<any, any> | Thunk<Result>,
) => Result

export type ThunkExtra = {
  logger: {
    log: (args: any) => null
  }
}

export type Thunk<Result> = (
  dispatch: Dispatch,
  getState: GetState,
  extra?: ThunkExtra,
) => Result
