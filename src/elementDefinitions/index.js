const ElementGrid = (() => {
  const { transformGamePosToElementId, getIdInDirection, getOppositeDirection, random } = require('../util/helpers')
  const g = require('../gameManagement/gameManager')
  const e = require('../util/events')
  const m = require('../gui/messages')
  const s = require('../assets/sprites')
  const { evaluateConnections } = require('../gameManagement/connectionManager')
  const { openDialog } = require('../gui/dialog')
  const { scrollTo } = require('../gui/scrollHelper')

  const { createHouse, manageHouse } = require('./house')
  const { createHub, manageHub } = require('./hub')
  const { createCable, manageCable } = require('./cable')

  const constructors = {
    HOUSE: createHouse,
    CABLE: createCable,
    HUB: createHub
  }

  const manager = {
    HOUSE: manageHouse,
    HUB: manageHub,
    CABLE: manageCable
  }

  let elements = {}

  const buildElement = (gamePos, type) => {
    if (g.getBalance() - BUILDING_COSTS[type] < 0) return false
    const elementId = transformGamePosToElementId(gamePos)
    if (isValidPosition(elementId)) {
      const newElementCfg = {
        connections: getConnections(gamePos)
      }
      elements[elementId] = Object.assign(newElementCfg, constructors[type](newElementCfg))
      g.payBuildingCosts(type)
      evaluateConnections(elements)
      return true
    }
    return false
  }

  const deleteElement = gamePos => {
    if (g.getBalance() - BUILDING_COSTS['DELETE'] < 0) return false
    const elId = transformGamePosToElementId(gamePos)
    if (elements.hasOwnProperty(elId) && elements[elId].type !== 'HOUSE') {
      removeConnections(elId)
      delete elements[elId]
      g.payBuildingCosts('DELETE')
      return true
    }
    return false
  }

  const removeConnections = id => {
    const el = elements[id]
    el.connections.forEach(dir => {
      const n = elements[getIdInDirection(id, dir)]
      const op = getOppositeDirection(dir)
      n.connections = n.connections.filter(con => con !== op)
      if (n.type === 'CABLE') {
        n.image = s.CABLE(n.connections)
      }
    })
  }

  const maintainHub = (hubId, cost) => {
    const h = elements[hubId]
    h.status = 'active'
    h.age = Math.floor(h.age / 4)
    g.payMaintenance(cost)
  }

  const openHubDialog = hubId => {
    if (elements[hubId].status === 'active') {
      openDialog('Maintain Hub', 'The hub is working fine. Do You want to maintain it to improve reliability?', [
        [`Maintain ($${MAINTENANCE_COST})`, () => maintainHub(hubId, MAINTENANCE_COST), true],
        ['Cancel', null]
      ])
    } else if (elements[hubId].status === 'defective') {
      openDialog('Maintain Hub', 'The hub is defective. It needs repairing to work at full capacity. Do you want to repair it?', [
        [`Repair ($${REPAIR_COST})`, () => maintainHub(hubId, REPAIR_COST), true],
        ['Cancel', null]
      ])
    } else {

    }
  }

  const isValidPosition = (elementId) => !elements.hasOwnProperty(elementId)

  const getConnections = gamePos => {
    const connections = []

    Object.keys(DIRECTIONS).forEach(directionKey => {
      const neighbourId = getIdInDirection(gamePos, directionKey)
      if (elements.hasOwnProperty(neighbourId)) {
        connections.push(directionKey)
        const n = elements[neighbourId]
        n.connections.push(getOppositeDirection(directionKey))
        if (n.type === 'CABLE') {
          n.image = s.CABLE(n.connections)
        }
      }
    })
    return connections
  }

  const getElements = () => elements

  const getElementsOfType = type => {
    return Object.keys(elements).reduce((acc, element) => {
      const el = elements[element]
      if (el.type === type) {
        acc[element] = el
      }
      return acc
    }, {})
  }

  const getOnlineHouseholds = () => {
    const households = getElementsOfType('HOUSE')
    return Object.keys(households).filter(h => households[h].status === 'online' || households[h].status === 'slow')
  }

  const getWorkingHubs = () => {
    const hubs = getElementsOfType('HUB')
    return Object.keys(hubs).filter(h => hubs[h].status !== 'destroyed')
  }

  const getEnergyConsumption = () => getWorkingHubs().length * POWER_CONSUMPTION_PER_HUB

  const getProceeds = () => getOnlineHouseholds().length * PROCEEDS_PER_HOUSEHOLD - getEnergyConsumption()

  const getRandHousePos = () => ({
    x: random(0, 30),
    y: random(0, 20)
  })

  e.on('NEXT_DAY', () => {
    for (let e in elements) {
      const el = elements[e]
      if (el.type === 'HOUSE' && el.status === 'canceled') {
        removeConnections(e)
        m.postMessage('Cancelation', `${el.name} just canceled his/her service contract. As this is clearly your fault we will fine you $${FINE}.`, null, null, 'danger')
        delete elements[e]
        g.payFine()
        continue
      }
      const manage = manager[el.type](elements)
      manage(el).forEach(fn => fn())
    }
    evaluateConnections(elements)
  })

  e.on('NEXT_MONTH', () => {
    g.addProceeds(getProceeds())
  })

  e.on('NEW_HOUSE', () => {
    const housePos = getRandHousePos()
    buildElement(housePos, 'HOUSE') // ToDo try again when space is blocked
    m.postMessage('New Contract', `We just received a new contract from ${elements[transformGamePosToElementId(housePos)].name} at Customerstreet ${housePos.x}/${housePos.y}. The beginning of service is on ${g.getFutureDate(DAYS_TILL_CONTRACT_START)}. Please ensure a stable connection by then.`, 'Show on Map', () => scrollTo(housePos), 'success')
  })

  return { buildElement, deleteElement, getElements, getElementsOfType, getEnergyConsumption, getOnlineHouseholds, openHubDialog }
})()

module.exports = ElementGrid
