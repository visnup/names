import { find, map, max, maxBy, min, minBy, reject, startCase } from 'lodash'

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
    // TODO don't need to recompute all of the extents
    let extents = { year: [], count: [] }
    names.forEach(({ counts }) => {
      extents = {
        year: [
          min([extents.year[0], minBy(counts.null, 'year').year]),
          max([extents.year[1], maxBy(counts.null, 'year').year])
        ],
        count: [
          0,
          max([extents.count[1], maxBy(counts.null, 'count').count])
        ]
      }
    })
    return {
      ...state,
      extents,
      names
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
    // TODO don't need to recompute all of the extents
    let extents = {
      year: [
        min([state.extents.year[0], minBy(action.counts.null, 'year').year]),
        max([state.extents.year[1], maxBy(action.counts.null, 'year').year])
      ],
      count: [
        0,
        max([state.extents.count[1], maxBy(action.counts.null, 'count').count])
      ]
    }
    let year = state.year || extents.year[1]
    let names = map(state.names, (name) => {
      if (name.name === action.name)
        return { ...name, counts: action.counts }
      else
        return name
    })

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
