const Grid = (() => {
  const { transformElementIdToGamePos } = require('../util/helpers')
  const { createOffscreenCanvas } = require('../util/canvas')
  const { getElements } = require('../elementDefinitions')

  const W = WORLD_WIDTH
  const H = WORLD_HEIGHT
  const F = FIELD_SIZE
  const cnv = createOffscreenCanvas(W, H)
  const ctx = cnv.getContext('2d')

  const drawGridLines = () => {
    const cnv = createOffscreenCanvas(W, H)
    const ctx = cnv.getContext('2d')
    ctx.strokeStyle = 'rgba(0, 0, 0, .3)'
    for (let x = 0; x < W; x += F) {
      for (let y = 0; y < H; y += F) {
        ctx.rect(x, y, F, F)
      }
    }
    ctx.stroke()
    return cnv
  }

  const gridlineCnv = drawGridLines()

  function drawElements (ctx, e) {
    Object.keys(e).forEach(elementId => {
      const gamePos = transformElementIdToGamePos(elementId)
      ctx.drawImage(e[elementId].image, gamePos.x * F + W / 2, gamePos.y * F + H / 2)
    })
  }

  const drawGrid = () => {
    ctx.clearRect(0, 0, W, H)
    drawElements(ctx, getElements())
    ctx.drawImage(gridlineCnv, 0, 0)
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
