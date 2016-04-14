import { find, map, max, maxBy, min, minBy, reduce, reject, startCase } from 'lodash'

const initialState = {
  newName: null,
  names: [],

  extents: {
    year: [],
    count: []
  },
  year: 0
}

let reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'new':
    return {
      ...state,
      newName: action.name
    }
  case 'add': {
    if (find(state.names, { name: action.name }))
      return state
    else
      return {
        ...state,
        newName: null,
        names: [
          { name: startCase(action.name.toLowerCase()),
            expanded: action.expanded },
          ...state.names
        ]
      }
  }
  case 'remove': {
    let names = reject(state.names, { name: action.name })
    let extents = reduce(names, (outer, { extents }) => {
      if (extents)
        return {
          year: [ min([...outer.year, ...extents.year]), max([...outer.year, ...extents.year]) ],
          count: [ 0, max([...outer.count, ...extents.count]) ]
        }
      else
        return outer
    }, { year: [], count: [] })

    return { ...state, extents, names }
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
    if (!action.counts || !action.counts.null)
      return state

    action.extents = {
      year: [ minBy(action.counts.null, 'year').year, maxBy(action.counts.null, 'year').year ],
      count: [ 0, maxBy(action.counts.null, 'count').count ]
    }
    let extents = {
      year: [ min([...state.extents.year, ...action.extents.year]), max([...state.extents.year, ...action.extents.year]) ],
      count: [ 0, max([...state.extents.count, ...action.extents.count]) ]
    }
    let names = map(state.names, (name) => {
      if (name.name === action.name)
        return { ...name, counts: action.counts, extents: action.extents }
      else
        return name
    })
    let year = state.year || extents.year[1]

    return { ...state, names, extents, year }
  }

  case 'brush':
    if (state.year !== action.year)
      return { ...state, year: action.year }
    else
      return state

  default:
    return state
  }
}

export default reducer
