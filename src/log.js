import store from './store'

export const map = (m) => {
  for (let y = 0; y < store.getState().params.height; ++y) {
    printErr(
      m
        .filter(c => c.y === y)
        .sort((c1, c2) => c1.x - c2.x)
        .map(cell => (cell.danger ? '!' : cell.value))
        .join(' ')
    )
  }
}

export default {
  map,
}
