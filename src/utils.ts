import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from './status'

type RequestHandle<T> =
  & { handle: RequestState<T>, refresh: () => void }
  & (
    | { state: STATUS_LOADING, response: T, error: null }
    | { state: STATUS_LOADING, response: null, error: any }
    | { state: STATUS_LOADING, response: null, error: null }
    | { state: STATUS_SUCCESS, response: T, error: null }
    | { state: STATUS_FAILURE, response: null, error: any }
  )

/** @deprecated */
type RequestState<T> = RequestHandle<T>

const nop = () => {}

export const createRequestHandle = <T>(): RequestHandle<T> => {
  const handle = {
    state: STATUS_LOADING,
    response: null,
    error: null,
    refresh: nop
  } as any

  handle.handle = handle

  return handle as RequestHandle<T>
}

/** @deprecated */
export const createRequestState = createRequestHandle
