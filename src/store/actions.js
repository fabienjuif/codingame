export const addParam = (param) => {
  return {
    type: 'ADD_PARAM',
    payload: param,
  }
}

export const addCell = (cell) => {
  return {
    type: 'ADD_CELL',
    payload: cell,
  }
}
