import pathFinding from './pathfinding'
import store, { addParam, addCell } from './store'
import log from './log'
import { ROUND_WAIT } from './constants'

const inputs = readline().split(' ')
store.dispatch(addParam({ key: 'width', value: parseInt(inputs[0], 10) }))
store.dispatch(addParam({ key: 'height', value: parseInt(inputs[1], 10) }))
store.dispatch(addParam({ key: 'myId', value: parseInt(inputs[2], 10) }))

const visitedBoxes = []
let map
let boxes
let me
let round = 0
let safeCells

const closeEnough = (boxe) => {
  const sameLine =
  (
    boxe.y === me.y &&
    (
      boxe.x - 1 === me.x ||
      boxe.x + 1 === me.x
    )
  )

  const sameColumn =
  (
    boxe.x === me.x &&
    (
      boxe.y - 1 === me.y ||
      boxe.y + 1 === me.y
    )
  )

  return sameLine || sameColumn
}

const getCell = (coords) => {
  const cells = map.filter(cell => cell.x === coords.x && cell.y === coords.y)

  if (cells && cells.length > 0) return cells[0]
  return undefined
}
const addBox = box => boxes.push(box)
const createCell = cell => Object.assign({}, cell, {
  isBox: !Number.isNaN(parseInt(cell.value, 10)),
})

const getBestBox = () => {
  const closestBoxes = boxes
    // Visited boxes are not eligibles
    .filter(boxe => visitedBoxes.filter(vb => vb.x === boxe.x && vb.y === boxe.y).length === 0)
    // Closer boxes are best
    .sort((c1, c2) => {
      const d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y)
      const d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y)

      return (d1 - d2)
    })
    // First 5
    .slice(0, 5)

  printErr(`closestBoxes: ${JSON.stringify(closestBoxes.slice(0, 5))}`)

  return pathFinding(
    closestBoxes,
    me,
    (coords) => {
      const cell = getCell(coords)

      // Don't even try to go to the cell if
      // - It's not in the map
      if (!cell) return false
      // - It's not empty
      if (cell.value !== '.') return false
      // - It's a danger zone
      if (cell.danger) return false

      return true
    },
    (cells) => {
      const sorted = cells.sort((c1, c2) => {
        const d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y)
        const d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y)

        return (d1 - d2)
      })

      printErr(`closestBoxes/nextCells: ${JSON.stringify(sorted)}`)

      return sorted
    }
  )
}

const getClosestSafeCell = () => {
  const closestSafeCells = safeCells
    .sort((c1, c2) => {
      const d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y)
      const d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y)

      return (d1 - d2)
    })

  printErr(`closestSafeCells: ${JSON.stringify(closestSafeCells.slice(0, 5))}`)

  return pathFinding(
    closestSafeCells,
    me,
    (coords) => {
      const cell = getCell(coords)

      // Don't even try to go to the cell if
      // - It's not in the map
      if (!cell) return false
      // - It's not empty
      if (cell.value !== '.') return false

      return true
    },
    (cells) => {
      const sorted = cells.sort((c1, c2) => {
        const d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y)
        const d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y)

        return (d1 - d2)
      })

      printErr(`closestSafeCells/nextCells: ${JSON.stringify(sorted)}`)

      return sorted
    }
  )
}

// game loop
while (true) {
  boxes = []
  map = []
  for (let y = 0; y < store.getState().params.height; y++) {
    const row = readline()

    map = map.concat(row.split('').map((value, x) => {
      const cell = createCell({ value, x, y })

      store.dispatch(addCell(cell))

      return cell
    }))
    map.filter(cell => cell.isBox).forEach(addBox)
  }

  const entities = parseInt(readline(), 10)
  for (let i = 0; i < entities; i++) {
    const entity = readline().split(' ')
    const entityType = parseInt(entity[0], 10)
    const owner = parseInt(entity[1], 10)
    const x = parseInt(entity[2], 10)
    const y = parseInt(entity[3], 10)
    const param1 = parseInt(entity[4], 10)
    const param2 = parseInt(entity[5], 10)

    if (entityType === 0 && owner === store.getState().params.myId) {
      me = { id: store.getState().params.myId, x, y, nbBombs: param1 }
    } else if (entityType === 1) {
      // Place bomb
      map
        .filter(cell => cell.x === x && cell.y === y)
        .forEach((cell) => {
          cell.value = param1 === 1 ? 'B' : 'b'
          cell.tick = param1
          cell.range = param2
        })

      // Dangers zones
      map
        .filter(cell =>
             (cell.y === y && Math.abs(cell.x - x) <= param2)
          || (cell.x === x && Math.abs(cell.y - y) <= param2)
        )
      .forEach((cell) => {
        cell.danger = true
      })
    }
  }

  safeCells = map.filter(cell => cell.danger !== true && cell.value === '.')
  log.map(map)

  round += 1
  if (round < ROUND_WAIT) {
    print(`MOVE ${me.x} ${me.y}`)
  } else {
    const bestBox = getBestBox()
    const safeCell = getClosestSafeCell()
    if (safeCell && bestBox && me.x === safeCell.x && me.y === safeCell.y) {
      if (closeEnough(bestBox)) {
        print(`BOMB ${me.x} ${me.y}`)
      } else {
        print(`MOVE ${bestBox.x} ${bestBox.y}`)
      }
    } else if (safeCell) {
      printErr(`safeCell ${JSON.stringify(safeCell)}`)
      print(`MOVE ${safeCell.x} ${safeCell.y}`)
    } else {
      print(`MOVE ${me.x} ${me.y} snif`)
    }
  }
}
