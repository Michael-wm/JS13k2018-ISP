const { random } = require('../util/helpers')
const m = require('../gui/messages')
const s = require('../assets/sprites')

const createHub = elementCfg => {
  return {
    type: 'HUB',
    age: 0,
    status: 'active',
    bandwidth: BANDWIDTH_PER_HUB,
    image: s.HUB('active')
  }
}

const incAge = h => {
  h.age++
  if (h.status !== 'destroyed') {
    checkForDefects(h)
  }
}

const checkForDefects = h => {
  const t = random(HUB_WARRANTY, HUB_DEFECT_RANGE + HUB_WARRANTY)
  if (t < h.age) {
    if (random(0, (HUB_DEFECT_RANGE - h.age) * (h.status === 'defective' ? 0.1 : 1)) < HUB_DESTROYED_CHANCE) {
      h.status = 'destroyed'
      m.postMessage('Hub Destroyed', `The hub at x/y is destroyed beyond repair. It needs to be demolished.`, 'Show hub on map', null, 'danger')
    } else if (h.status !== 'defective') {
      h.status = 'defective'
      m.postMessage('Hub Defective', `The hub at `, 'Show hub on map', null, 'warning')
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

const manageHub = elements => h => {
  let fnArray = []
  fnArray.push(incAge.bind(elements, h))
  fnArray.push(checkBandwidth.bind(elements, h))
  fnArray.push(setImage.bind(elements, h))
  return fnArray
}

module.exports = {
  createHub,
  manageHub
}
