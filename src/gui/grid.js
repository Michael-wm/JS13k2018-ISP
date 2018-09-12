const { transformElementIdToGamePos } = require('../util/helpers')
const { createOffscreenCanvas } = require('../util/canvas')
const { getElements } = require('../elementDefinitions')

const Grid = (() => {
  const gridSize = {
    x: WORLD_WIDTH,
    y: WORLD_HEIGHT
  }

  const cnv = createOffscreenCanvas(gridSize.x, gridSize.y)
  const ctx = cnv.getContext('2d')

  function drawElements (ctx, e) {
    Object.keys(e).forEach(elementId => {
      const gamePos = transformElementIdToGamePos(elementId)
      ctx.drawImage(e[elementId].image, gamePos.x * FIELD_SIZE, gamePos.y * FIELD_SIZE)
    })
  }

  const drawGrid = () => {
    ctx.clearRect(0, 0, gridSize.x, gridSize.y)
    drawElements(ctx, getElements())
    return cnv
  }

  const getGridSize = e => {
    if (!e) {
      return gridSize
    }
  }

  return { drawGrid, getGridSize }
})()

module.exports = Grid
