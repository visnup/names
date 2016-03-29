import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import App from './app'

const store = createStore((state, action) => {
  if (typeof state === 'undefined') return {
    name: null,
    names: [],
    countsByName: {}
  }

  switch (action.type) {
  case 'new':
    return { ...state, name: action.name }
  case 'add':
    return { ...state, name: null, names: [ ...state.names, action.name ] }

  case 'countsFetch':
    return {
      ...state,
      countsByName: {
        ...state.countsByName,
        [action.name]: action.counts
      }
    }

  default:
    return state
  }
},
applyMiddleware(
  require('redux-thunk').default,
  //require('redux-logger')()
))

render(
  <Provider store={store}><App /></Provider>,
  document.body.appendChild(document.createElement('div'))
)
