import { map, max, maxBy, min, minBy, reject } from 'lodash'

const initialState = {
  newName: null,
  names: [],

  extents: []
}

let reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'new':
    return {
      ...state,
      newName: action.name
    }
  case 'add': {
    return {
      ...state,
      newName: null,
      names: [ ...state.names, { name: action.name, expanded: false } ]
    }
  }
  case 'remove': {
    return {
      ...state,
      names: reject(state.names, { name: action.name })
    }
  }
  case 'expand': {
    return {
      ...state,
      names: map(state.names, (name) => {
        if (name.name === action.name)
          return { ...name, expanded: !name.expanded }
        else
          return name
      })
    }
  }

  case 'countsFetch': {
    let extents = [
      min([state.extents[0], minBy(action.counts._all, 'year').year]),
      max([state.extents[0], maxBy(action.counts._all, 'year').year])
    ]
    let names = map(state.names, (name) => {
      if (name.name === action.name)
        return { ...name, counts: action.counts }
      else
        return name
    })

    return { ...state, extents, names }
  }

  default:
    return state
  }
}

export default reducer
