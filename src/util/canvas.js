const createOffscreenCanvas = (width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const drawSpriteString = (ctx, sprite, color) => {
  const pixelArray = []
  const width = ctx.canvas.width / 2

  sprite.replace(/./g, a => {
    const c = a.charCodeAt()
    pixelArray.push(c & 7)
    pixelArray.push((c >> 3) & 7)
  })

  for (let j = 0; j < width; j++) {
    for (let i = 0; i < width; i++) {
      if (pixelArray[j * width + i]) {
        ctx.fillStyle = '#' + color.substr(6 * (pixelArray[j * width + i] - 1), 6)
        ctx.fillRect(i * 2, j * 2, 2, 2)
      }
    }
  }
}

module.exports = {
  createOffscreenCanvas,
  drawSpriteString
}
