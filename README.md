<h1 align="center" style="text-align: center;">Vue AutoFetch</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/vue-autofetch">
    <img src="https://img.shields.io/npm/v/vue-autofetch.svg?style=flat" alt="npm">
  </a>
  <a href="https://travis-ci.org/Tarik02/vue-autofetch">
    <img src="https://travis-ci.org/Tarik02/vue-autofetch.svg?branch=master" alt="travis">
  </a>
</p>

<p align="center">Better and Vue-style data fetching</p>


## Installation
```bash
$ yarn add vue-autofetch
# or
$ npm i --save vue-autofetch
```


## Getting Started

**[Vue Plugin](https://vuejs.org/v2/guide/plugins.html#Using-a-Plugin)**
```js
import Vue from 'vue'
import * as AutoFetch from 'vue-autofetch'

Vue.use(AutoFetch)

// use with in any place of the app
```

**[Local Component Registration](https://vuejs.org/v2/guide/components-registration.html#Local-Registration)**
```js
import AutoFetch from 'vue-autofetch'

export default {
  components: {
    AutoFetch
  },

  // ...
}
```


## API

Props:
- `clear` [default: `false`] - if true, then set response and error to null if new request has started.
- `data` [required] - request data, passed to handler. If changes, then component automatically downloads new data.
- `handler` [default: `fetch`] - function which is called in order to do request. Should return a promise. If resolved, then state is changed to `success` and result is passed to `result` variable. If rejected, then state is changed to `failure` and error is passed to `error` variable.
- `threshold` [default: `fn => () => fn()`] - function that controls frequency of requests (for example debounce or throttle from lodash). It receives a function [1] which should return a function which calls function [1].

Methods:
- `refresh` - reload request.

Events:
- `success` - called when received a successful response. Arguments: `response`.
- `failure` - called when request failed. Arguments: `error`.
- `start` - called when request has started (`state` set to `'loading'`). Arguments: empty.
- `done` - called when request is resolved or errored. Arguments: `success` (`true` or `false`).


## Usage

The component can be used in several ways:

```html
<!-- as a renderless component -->
<template>
  <div>
    <auto-fetch ref="items" v-model="items" :data="request" />

    <input v-model="page" />

    <template v-if="items.state === 'loading'">
      Loading...
    </template>
    <template v-else-if="items.state === 'success'">
      Success: {{ items.result }}
    </template>
    <template v-else-if="items.state === 'failure'">
      <div>
        Error: {{ items.error }}
        <button @click="$refs.items.refresh()">Refresh</button>
      </div>
    </template>
  </div>
</template>

<!-- as a component with default slot -->
<template>
  <auto-fetch :data="request" v-slot:default="{ state, result, error }">
    <input v-model="page" />

    <template v-if="state === 'loading'">
      Loading...
    </template>
    <template v-else-if="state === 'success'">
      Success: {{ result }}
    </template>
    <template v-else-if="state === 'failure'">
      <div>
        Error: {{ error }}
        <button @click="refresh">Refresh</button>
      </div>
    </template>
  </auto-fetch>
</template>

<!-- as a component with slots for different states -->
<template>
  <div>
    <input v-model="page" />

    <auto-fetch :data="request">

      <template v-slot:loading>
        Loading...
      </template>

      <template v-slot:success="{ result }">
        Success: {{ result }}
      </template>

      <template v-slot:failure="{ error, refresh }">
        <div>
          Error: {{ error }}
        </div>
        <button @click="refresh">Refresh</button>
      </template>
    </auto-fetch>
  </div>
</template>

<script>
import AutoFetch, { createRequestState } from 'vue-autofetch'

export default {
  components: {
    AutoFetch
  },

  data: () => ({
    page: 1,

    items: createRequestState()
  }),

  computed: {
    request () {
      // NOTE: By default, JavaScript fetch() is used (url and rest as arguments)

      return {
        url: 'https://example.com/api/some-method',

        method: 'POST',

        data: {
          page: this.page
        }
      }
    }
  }
}
</script>
```

As I stated before, `fetch()` is used, but you should override it and even provide some throttling.
You can do this by extending `auto-fetch` component or passing some global variable as props: `<auto-fetch v-model="items" :data="request" v-bind="$request" />`.

Example of global mixin for this:
```js
import _ from 'lodash'
import Vue from 'vue'

Vue.mixin({
  computed: {
    $request () {
      return {
        handler: data => {
          // Do the request, return a promise
        },

        threshold: fn => _.debounce(fn, 300, {
          leading: true,
          trailing: true
        })
      }
    }
  }
})
```


## License

Released under the [MIT license](https://github.com/Tarik02/vue-autofetch/blob/master/LICENSE.md).
