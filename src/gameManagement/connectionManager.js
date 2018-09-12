const ConnectionManager = (() => {
  const { pathDetection } = require('../util/pathdetection')

  let state = {
    hubs: {},
    houses: {}
  }

  const getElementsOfType = (type, e) => {
    return Object.keys(e).reduce((acc, element) => {
      const el = e[element]
      if (el.type === type && el.status !== 'canceled' && el.status !== 'destroyed') {
        acc[element] = el
      }
      return acc
    }, {})
  }

  const evaluateConnections = e => {
    const houses = getElementsOfType('HOUSE', e)
    const hubs = getElementsOfType('HUB', e)
    state = { hubs: {}, houses: {} }

    for (let houseId in houses) {
      const house = e[houseId]
      house.status = 'offline'
      state.houses[houseId] = {
        deliveredBandwidth: 0,
        connectedHubs: []
      }
      for (let hubId in hubs) {
        const hubConnection = pathDetection(e)(houseId, hubId)
        if (hubConnection.length) {
          addConnection(hubConnection, houseId, hubId)
        }
      }
    }

    sortConnections()
    calculateBandwidth(e)
    setHouseStatus(e)
  }

  const addConnection = (connection, houseId, hubId) => {
    const { houses, hubs } = state
    if (!hubs.hasOwnProperty(hubId)) {
      hubs[hubId] = {}
      hubs[hubId].primary = {}
    }
    hubs[hubId][houseId] = connection
    houses[houseId].connectedHubs.push(hubId)
  }

  const sortConnections = () => {
    const { houses, hubs } = state
    Object.keys(houses).forEach(hId => {
      const h = houses[hId]
      if (h.connectedHubs.length) {
        if (h.connectedHubs.length > 1) {
          h.connectedHubs = h.connectedHubs.sort((a, b) => hubs[a][hId].length < hubs[b][hId].length ? -1 : 1)
        }
        const primaryHub = hubs[h.connectedHubs[0]]
        primaryHub.primary[hId] = primaryHub[hId]
        delete primaryHub[hId]
      }
    })
  }

  const calculateBandwidth = e => {
    const { hubs, houses } = state
    Object.keys(hubs).forEach(hubId => {
      const connectedHouses = Object.keys(hubs[hubId].primary)
      const bandwidthPerHouse = Math.floor(e[hubId].bandwidth / connectedHouses.length)
      let spareBandwidth = 0
      connectedHouses.forEach(h => {
        houses[h].deliveredBandwidth = hubs[hubId].primary[h].length < HUB_STABLE_RANGE ? bandwidthPerHouse : bandwidthPerHouse / 2
        const sbw = bandwidthPerHouse - e[h].requiredBandwidth
        spareBandwidth += sbw > 0 ? sbw : 0
      })
      hubs[hubId].spareBandwidth = spareBandwidth > 0 ? spareBandwidth : 0
    })
  }

  const setHouseStatus = e => {
    const houses = state.houses
    Object.keys(houses).forEach(h => {
      if (!houses[h].connectedHubs.length) {
        e[h].status = 'offline'
      } else if (houses[h].deliveredBandwidth < e[h].requiredBandwidth) {
        e[h].status = 'slow'
        if (houses[h].deliveredBandwidth < e[h].requiredBandwidth / 3) {
          e[h].status = 'offline'
        }
      } else {
        e[h].status = 'online'
      }
    })
  }

  return { evaluateConnections }
})()

module.exports = ConnectionManager
