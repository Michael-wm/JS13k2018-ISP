const Scroll = (() => {
  const H = WORLD_HEIGHT
  const H2 = WORLD_HEIGHT / 2
  const W = WORLD_WIDTH
  const W2 = WORLD_WIDTH / 2
  const F = FIELD_SIZE

  let scrollPos = {
    x: 0,
    y: 0
  }
  let cnvSize = {
    w: 0,
    h: 0
  }

  const setCnvSize = (w, h) => { cnvSize = { w, h } }

  const getScrollPos = () => scrollPos

  const up = () => {
    scrollPos.y += F
    checkBoundaries()
  }

  const down = () => {
    scrollPos.y -= F
    checkBoundaries()
  }

  const left = () => {
    scrollPos.x += F
    checkBoundaries()
  }

  const right = () => {
    scrollPos.x -= F
    checkBoundaries()
  }

  const checkBoundaries = () => {
    const { w, h } = cnvSize
    if (scrollPos.x < -W2 + w) {
      scrollPos.x = -W2 + w
    } else if (scrollPos.x > W2) {
      scrollPos.x = W2
    }
    if (scrollPos.y < -H2 + h) {
      scrollPos.y = -H2 + h
    } else if (scrollPos.y > H2) {
      scrollPos.y = H2
    }
  }

  const scrollTo = gp => {
    const { w, h } = cnvSize
    const x = Math.floor(-(gp.x * F) + w / 2)
    const y = Math.floor(-(gp.y * F) + h / 2)
    scrollPos = { x, y }
    checkBoundaries()
  }

  return { getScrollPos, up, down, left, right, scrollTo, setCnvSize }
})()

module.exports = Scroll
