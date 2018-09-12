const s = require('../assets/sprites')
const m = require('../gui/messages')
const { generateName } = require('../assets/customers')

const createHouse = elementCfg => {
  return {
    type: 'HOUSE',
    status: 'pending',
    contractStart: DAYS_TILL_CONTRACT_START,
    image: s.HOUSE('offline'),
    daysOffline: 0,
    name: generateName(),
    requiredBandwidth: BASE_BANDWIDTH
  }
}

const checkOnlineStatus = h => {
  return h.status
}

const countToContractStart = h => {
  h.contractStart--
  if (h.contractStart === 0) {
    h.status = checkOnlineStatus(h)
  }
}

const offlineCounter = h => {
  const s = h.status
  if (h.daysOffline === 0) {
    if (s === 'offline') {
      m.postMessage(h.name, `Dude, where is my interwebz. Nothing's working. Fix this ASAP!`, null, null, 'user')
    } else {
      m.postMessage(h.name, `When will the connection be faster, brother?`, null, null, 'user')
    }
  } else if (h.daysOffline >= 30) {
    m.postMessage(h.name, `I'm cancelling my contract. You guys are incompetent. So sad.`, null, null, 'user')
    h.status = 'canceled'
  }
  h.daysOffline += h.status === 'offline' ? 3 : 1
}

const setImage = h => {
  h.image = s.HOUSE(h.status)
}

const manageHouse = elements => h => {
  let fnArray = []
  if (h.contractStart > 0) {
    fnArray.push(countToContractStart.bind(elements, h))
  } else if (h.status !== 'online') {
    fnArray.push(offlineCounter.bind(elements, h))
  } else {
    h.daysOffline = 0
  }
  fnArray.push(setImage.bind(elements, h))
  return fnArray
}

module.exports = {
  createHouse,
  manageHouse
}
