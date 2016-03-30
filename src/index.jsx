import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { max, maxBy, min, minBy } from 'lodash'

import App from './app'

const store = createStore((state, action) => {
  if (typeof state === 'undefined') return {
    name: null,
    names: [],
    extents: [],
    countsByName: {}
  }

  switch (action.type) {
  case 'new':
    return { ...state, name: action.name }
  case 'add':
    return { ...state, name: null, names: [ ...state.names, action.name ] }

  case 'countsFetch': {
    let extents = [
      min([state.extents[0], minBy(action.counts._all, 'year').year]),
      max([state.extents[0], maxBy(action.counts._all, 'year').year])
    ]
    return {
      ...state,
      extents,
      countsByName: {
        ...state.countsByName,
        [action.name]: action.counts
      }
    }
  }

  default:
    return state
  }
},
applyMiddleware(
  require('redux-thunk').default,
  require('redux-logger')()
))

render(
  <Provider store={store}><App /></Provider>,
  document.body.appendChild(document.createElement('div'))
)
