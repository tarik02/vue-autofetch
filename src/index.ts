import Vue from 'vue'

import AutoFetch from './components/AutoFetch'

export * from './status'
export * from './utils'

export const install = (vue: typeof Vue) => {
  vue.component('AutoFetch', AutoFetch)
}

export default AutoFetch
