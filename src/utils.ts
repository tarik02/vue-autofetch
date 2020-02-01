import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from './status'

type RequestState<T> =
  | { state: STATUS_LOADING, response: T, error: null }
  | { state: STATUS_LOADING, response: null, error: any }
  | { state: STATUS_LOADING, response: null, error: null }
  | { state: STATUS_SUCCESS, response: T, error: null }
  | { state: STATUS_FAILURE, response: null, error: any }

export const createRequestState = <T>(): RequestState<T> => ({
  state: STATUS_LOADING,
  response: null,
  error: null
})
