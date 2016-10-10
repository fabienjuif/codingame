import { getCellKey } from '../utils'

const initState = {
  map: {},
  params: {},
}

export const mutate = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_CELL': return {
      ...state,
      map: {
        ...state.map,
        [getCellKey(action.payload)]: {
          ...state.map[getCellKey(action.payload)],
          ...action.payload,
        },
      },
    }
    case 'ADD_PARAM': return {
      ...state,
      params: {
        ...state.params,
        [action.payload.key]: action.payload.value,
      },
    }
    default: return state
  }
}
