import { MAX_LOOP_DIJSKTRA } from './constants'

const hasArrived = (target, current) => target.x === current.x && target.y === current.y

export default (cellsToGo, me, hasToTry, sortOpenCells) => {
  let nbLoop = 0

  return cellsToGo.find((cell) => {
    let current = { x: me.x, y: me.y }
    let openCells = [current]
    const closedCells = {}

    while (!hasArrived(cell, current) && openCells.length > 0) {
      if (nbLoop++ > MAX_LOOP_DIJSKTRA) return false

      current = openCells.shift()

      // Potentials cells to tests
      const potentials = [
        { ...current, x: current.x + 1 }, // right
        { ...current, x: current.x - 1 }, // left
        { ...current, x: current.y + 1 }, // top
        { ...current, x: current.y - 1 }, // bottom
      ]

      // Don't test already testes ones, and no elligibles ones
      for (const pot of potentials) {
        // FIXME : pot.x !== cell.x && pot.y !== cell.y
        if (!closedCells[`${pot.x}_${pot.y}`] && hasToTry(pot)) {
          openCells.push(pot)
        }
      }

      // Sort cells, the first is the next to try
      openCells = sortOpenCells([...openCells])

      // Add current cell in the viewed ones
      closedCells[`${current.x}_${current.y}`] = true
    }

    return hasArrived(cell, current)
  })
}
