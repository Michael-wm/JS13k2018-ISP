const { createOffscreenCanvas, drawSpriteString } = require('../util/canvas')

const getCableColor = id => {
  const colors = [
    '818085',
    '818085',
    '818085',
    '818085'
  ]
  const directions = Object.keys(DIRECTIONS)
  id.split('_').forEach(dir => {
    const pos = directions.indexOf(dir)
    if (pos >= 0) {
      colors[pos] = '000000'
    }
  })
  return '000000' + colors.join('') + '000000000000'
}

const typeString = (obj, base, arr, start = 0) => {
  if (start >= arr.length) {
    const newBase = arr.length > 1 ? base + '_' + arr[arr.length - 1] : base
    obj[newBase] = getCableColor(newBase)
    return obj
  } else {
    obj[base] = getCableColor(base)
    for (let i = start; i < arr.length; i++) {
      const newBase = base + '_' + arr[i]
      obj[newBase] = getCableColor(newBase)
      typeString(obj, newBase, arr.slice(i), start + 1)
    }
    return obj
  }
}

const generateCableTypes = () => {
  return Object.keys(DIRECTIONS).reduce((acc, dir, i, arr) => {
    return Object.assign(acc, typeString(acc, dir, arr.slice(i + 1)))
  }, {})
}
const spriteStrings = {
  CABLE: {
    image: '@@@[[@@@@@@[[@@@@@@[[@@@@@@[[@@@@@@[[@@@@@@[[@@@mmmIIRRRmmmIIRRRmmmIIRRRmmmIIRRR@@@dd@@@@@@dd@@@@@@dd@@@@@@dd@@@@@@dd@@@@@@dd@@@',
    types: generateCableTypes()
  },
  HOUSE: {
    image: '@@@II@@@@@@II@@@@@@QJ@@@@@@RR@@@@@PRRB@@@@RRRR@@IQRRRRJIIIRRRRIIIIRRRRIIIIRIJRII@@RIRR@@@@RIRR@@@@@II@@@@@@II@@@@@@II@@@@@@II@@@',
    types: {
      online: '00000000ff00000000000000000000000000000000',
      offline: '000000ff0000000000000000000000000000000000',
      slow: '000000ff7700000000000000000000000000000000'
    }
  },
  HUB: {
    image: '@@@II@@@@@@II@@@@@@II@@@@TRTRSS@@ZRbRRb@@RRTRTR@IIIIIIIIITbRRcSIIZRbRRbIIRRTRbRI@@@II@@@@RRRTSS@@ZbRRTR@@TRbRbb@@@@II@@@@@@II@@@',
    types: {
      active: '000000b3b3b300ff00b3b3b3000000000000000000',
      defective: '000000b3b3b3ff7700b3b3b3000000000000000000',
      destroyed: '000000b3b3b3ff0000999999000000000000000000'
    }
  }
}

const createSprite = (spriteString, color) => {
  const cnv = createOffscreenCanvas(FIELD_SIZE, FIELD_SIZE)
  const ctx = cnv.getContext('2d')
  drawSpriteString(ctx, spriteString, color)
  return cnv
}

const generateSpritesObject = () => {
  return Object.keys(spriteStrings).reduce((acc, spriteGroup) => {
    const currSpriteGroup = spriteStrings[spriteGroup] // i.e. HOUSE
    for (let type in currSpriteGroup.types) {
      if (!acc.hasOwnProperty(spriteGroup)) {
        acc[spriteGroup] = {}
      }
      acc[spriteGroup][type] = createSprite(currSpriteGroup.image, currSpriteGroup.types[type])
    }
    return acc
  }, {})
}

const Sprites = (() => {
  const img = generateSpritesObject()
  return {
    CABLE: connections => {
      return img.CABLE[connections.length > 0 ? connections.sort((a, b) => a < b ? -1 : 1).join('_') : 'EAST_NORTH_SOUTH_WEST']
    },

    HOUSE: status => img.HOUSE[status] || img.HOUSE.offline,

    HUB: status => img.HUB[status]
  }
})()

module.exports = Sprites
