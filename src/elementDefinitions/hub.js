const { random, transformElementIdToGamePos } = require('../util/helpers')
const m = require('../gui/messages')
const s = require('../assets/sprites')
const { scrollTo } = require('../gui/scrollHelper')

const createHub = elementCfg => {
  return {
    type: 'HUB',
    age: 0,
    status: 'active',
    bandwidth: BANDWIDTH_PER_HUB,
    image: s.HUB('active')
  }
}

const incAge = (h, hId) => {
  h.age++
  if (h.status !== 'destroyed') {
    checkForDefects(h, hId)
  }
}

const checkForDefects = (h, hId) => {
  const t = random(HUB_WARRANTY, HUB_DEFECT_RANGE + HUB_WARRANTY)
  const pos = transformElementIdToGamePos(hId)
  if (t < h.age) {
    if (random(0, (HUB_DEFECT_RANGE - h.age) * (h.status === 'defective' ? 0.1 : 1)) < HUB_DESTROYED_CHANCE) {
      h.status = 'destroyed'
      m.postMessage('Hub Destroyed', `The hub at ${pos.x}/${pos.y} is destroyed beyond repair. It needs to be demolished.`, 'Show hub on map', () => scrollTo(pos), 'danger')
    } else if (h.status !== 'defective') {
      h.status = 'defective'
      m.postMessage('Hub Defective', `The hub at ${pos.x}/${pos.y} is defective and no longer working at its full capacity. Please repair it immediately to prevent further damage.`, 'Show hub on map', () => scrollTo(pos), 'warning')
    }
  }
}

const checkBandwidth = h => {
  if (h.status === 'active') {
    h.bandwidth = BANDWIDTH_PER_HUB
  } else {
    h.bandwidth = Math.floor(BANDWIDTH_PER_HUB / 3)
  }
}

const setImage = h => {
  h.image = s.HUB(h.status)
}

const manageHub = elements => hId => {
  const h = elements[hId]
  let fnArray = []
  fnArray.push(incAge.bind(elements, h, hId))
  fnArray.push(checkBandwidth.bind(elements, h))
  fnArray.push(setImage.bind(elements, h))
  return fnArray
}

module.exports = {
  createHub,
  manageHub
}
