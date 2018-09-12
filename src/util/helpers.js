const { FIELD_SIZE, DIRECTIONS } = require('./globals')

const createGamePos = (x, y) => {
  if (typeof x === 'object') {
    y = x.y
    x = x.x
  }
  return {
    x: Math.floor(x / FIELD_SIZE),
    y: Math.floor(y / FIELD_SIZE)
  }
}

const getGamePosInDirection = (gamePos, direction) => {
  return {
    x: gamePos.x + DIRECTIONS[direction][0],
    y: gamePos.y + DIRECTIONS[direction][1]
  }
}

const getCanvasPosFromScreenPos = (canvas, screenX, screenY, scrollPos) => {
  const canvasRect = canvas.getBoundingClientRect()
  return { x: screenX - canvasRect.left - scrollPos.x, y: screenY - canvasRect.top - scrollPos.y }
}

const getIdInDirection = (gamePos, direction) => {
  if (typeof gamePos === 'string') {
    gamePos = transformElementIdToGamePos(gamePos)
  }
  return transformGamePosToElementId(getGamePosInDirection(gamePos, direction))
}

const getOppositeDirection = (direction) => {
  switch (direction) {
    case 'NORTH': return 'SOUTH'
    case 'EAST': return 'WEST'
    case 'SOUTH': return 'NORTH'
    case 'WEST': return 'EAST'
  }
}

const isNeighbour = (id1, id2) => {
  const pos1 = transformElementIdToGamePos(id1)
  const pos2 = transformElementIdToGamePos(id2)

  if (pos1.x === pos2.x) {
    return Math.abs(pos1.y - pos2.y) === 1
  } else if (pos1.y === pos2.y) {
    return Math.abs(pos1.x - pos2.x) === 1
  }
  return false
}

const isValidPosition = (gamePos, state) => !state.hasOwnProperty(transformGamePosToElementId(gamePos))

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const transformElementIdToGamePos = id => ({
  x: parseInt(id.replace(/_.*/g, '')),
  y: parseInt(id.replace(/^.+_/g, ''))
})

const transformGamePosToElementId = gamePos => `${gamePos.x}_${gamePos.y}`

module.exports = {
  createGamePos,
  getGamePosInDirection,
  getCanvasPosFromScreenPos,
  getIdInDirection,
  getOppositeDirection,
  isNeighbour,
  isValidPosition,
  random,
  transformElementIdToGamePos,
  transformGamePosToElementId
}
