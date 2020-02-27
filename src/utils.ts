import { STATE_IDLE, STATE_LOADING, STATE_SUCCESS, STATE_FAILURE } from './status'

type RequestHandle<T> =
  & { handle: RequestHandle<T>, refresh: () => void }
  & (
    | { state: STATE_IDLE, response: null, error: null }
    | { state: STATE_LOADING, response: T, error: null }
    | { state: STATE_LOADING, response: null, error: any }
    | { state: STATE_LOADING, response: null, error: null }
    | { state: STATE_SUCCESS, response: T, error: null }
    | { state: STATE_FAILURE, response: null, error: any }
  )

const nop = () => {}

export const createRequestHandle = <T>(): RequestHandle<T> => {
  const handle = {
    state: STATE_IDLE,
    response: null,
    error: null,
    refresh: nop
  } as any

  handle.handle = handle

  return handle as RequestHandle<T>
}

/** @deprecated */
export const createRequestState = createRequestHandle
