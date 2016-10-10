import reducers from './reducers'

let store

const dispatch = (action) => {
  store = { ...reducers(store, action) }
}

dispatch({ type: 'INIT' })

export default {
  getState: () => store,
  dispatch,
}
export * from './actions'
