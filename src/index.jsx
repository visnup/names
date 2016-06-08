import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'

import { groupBy } from 'lodash'

import App from './app'

const store = createStore(reducer, applyMiddleware(
  require('redux-thunk').default,
  require('redux-logger')({
    collapsed: true,
    predicate: (_, action) => action.type !== 'brush'
  })
))

fetch('/names/-')
  .then(response => response.json())
  .then(json => groupBy(json, 'state'))
  .then(grouped => {
    return store.dispatch({
      type: 'totals',
      name: null,
      counts: grouped
    })
  })
  .catch(e => console.error(e))

render(
  <Provider store={store}><App /></Provider>,
  document.body.appendChild(document.createElement('div'))
)
