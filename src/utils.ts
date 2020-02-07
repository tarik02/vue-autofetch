import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from './status'

type RequestState<T> =
  & { handle: RequestState<T>, refresh: () => void }
  & (
    | { state: STATUS_LOADING, response: T, error: null }
    | { state: STATUS_LOADING, response: null, error: any }
    | { state: STATUS_LOADING, response: null, error: null }
    | { state: STATUS_SUCCESS, response: T, error: null }
    | { state: STATUS_FAILURE, response: null, error: any }
  )

const nop = () => {}

export const createRequestState = <T>(): RequestState<T> => {
  const state = {
    state: STATUS_LOADING,
    response: null,
    error: null,
    refresh: nop
  } as any

  state.handle = state

  return state as RequestState<T>
}
