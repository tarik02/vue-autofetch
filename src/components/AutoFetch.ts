import Vue from 'vue'

import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from '../status'
import { createRequestHandle } from '../utils'

export default Vue.extend({
  props: {
    value: {
      type: Object,
      default: createRequestHandle
    },

    clear: {
      type: Boolean,
      default: false
    },

    data: Object,

    handler: {
      type: Function,
      default: () => (data: any) => fetch(data.url, data).then(response => response.json())
    },

    threshold: {
      type: Function,
      default: (fn: Function) => () => fn()
    }
  },

  data: () => ({
    _request: null
  }),

  computed: {
    _doRequest () {
      return this.threshold(() => this._doRequestReal())
    },

    _refreshFn () {
      return () => this.refresh()
    }
  },

  methods: {
    refresh () {
      if (!this.data) {
        this._clear(true)
        this.value.state = STATUS_SUCCESS
        return
      }

      if (this.value.state !== STATUS_LOADING) {
        this.value.state = STATUS_LOADING
        this._clear()
        this._start()
      }

      const oldRequest = this._request as any
      this._request = null
      if (oldRequest && oldRequest.abort) {
        oldRequest.abort()
      }

      this._doRequest()
    },

    _doRequestReal () {
      let request = this.handler(this.data)

      if (!request) {
        request = {
          promise: Promise.reject(new Error('Handler did not return a promise'))
        }
      }

      if (request.then && request.catch) {
        const promise = request

        if (promise.abort) {
          request = {
            promise,
            abort: () => promise.abort()
          }
        } else {
          request = {
            promise
          }
        }
      }

      request.promise.then((response: any) => {
        if (this._request !== request) {
          return
        }

        this.value.response = response
        this.value.state = STATUS_SUCCESS
        this.value.error = null

        this.$emit('success', response)
        this._done(true)
      })

      request.promise.catch((error: any) => {
        if (this._request !== request) {
          return
        }

        this.value.error = error
        this.value.state = STATUS_FAILURE
        this.value.response = null

        this.$emit('failure', error)
        this._done(false)
      })

      this._request = request
    },

    _clear (force: boolean = false) {
      if (!(this.clear || force)) {
        return false
      }

      this.value.response = null
      this.value.error = null

      return true
    },

    _start () {
      this.$emit('start')
    },

    _done (success: boolean) {
      this.$emit('done', success)
      this._request = null
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (value) {
        if (value) {
          value.refresh = (this as any)._refreshFn
          value.handle = value
        }
      }
    },

    data: {
      deep: true,
      handler () {
        this.refresh()
      }
    }
  },

  render () {
    const slot = this.$scopedSlots[this.value.state] || this.$scopedSlots['default']

    if (slot) {
      return slot(this.value)
    }

    return null as any
  },

  created () {
    this.refresh()
  },

  beforeDestroy () {
    if (this.value.state === STATUS_LOADING) {
      this._done(false)
    }
  },

  destroyed () {
    this._request = null
    this._clear(true)
  }
})
