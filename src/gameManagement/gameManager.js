const GameManager = (() => {
  const Event = require('../util/events')
  const { random } = require('../util/helpers')
  const { widenSpawnRange } = require('./spawnManager')

  let cs = {}
  let interval = null
  let range = 0
  let expenses = {
    construction: 0,
    fines: 0,
    maintenance: 0
  }

  const initCompanyState = state => {
    cs = state
    cs.currentDate.setFullYear(1995)
  }

  const nextDay = () => {
    if (cs.currentBalance < 0) {
      Event.fire('GAME_OVER')
    } else {
      const date = cs.currentDate
      const currMonth = date.getMonth()
      cs.currentDate = new Date(date.setDate(date.getDate() + 1))
      incSpawnChance()
      Event.fire('NEXT_DAY')
      if (cs.currentDate.getMonth() !== currMonth) {
        HOUSE_SPAWN_COOLDOWN++
        if (cs.currentDate.getMonth() % 2 === 0) {
          if (range < 50) {
            range += 10
            widenSpawnRange(range)
          }
          HUB_DESTROYED_CHANCE += 10
          HUB_DEFECT_RANGE -= 10
          FINE += 5
        }
        resetExpenses()
        Event.fire('NEXT_MONTH')
      }
    }
  }

  const incSpawnChance = () => {
    cs.spawnChance++
    if (random(0, 10) < cs.spawnChance) {
      cs.spawnChance = HOUSE_SPAWN_COOLDOWN
      Event.fire('NEW_HOUSE')
    }
  }

  const getBalance = () => cs.currentBalance

  const getExpenses = () => expenses

  const getDate = d => {
    const date = d || cs.currentDate
    return date.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getFutureDate = days => {
    const d = new Date(cs.currentDate.getTime())
    return getDate(new Date(d.setDate(d.getDate() + days)))
  }

  const addExpenses = (type, amount) => {
    expenses[type] += amount
  }

  const resetExpenses = () => {
    expenses = {
      construction: 0,
      fines: 0,
      maintenance: 0
    }
  }

  const setBalance = nb => {
    cs.currentBalance = nb
    Event.fire('UPDATE_BALANCE')
  }

  const addProceeds = amount => setBalance(getBalance() + amount)

  const payBuildingCosts = type => {
    setBalance(getBalance() - BUILDING_COSTS[type])
    addExpenses('construction', BUILDING_COSTS[type])
  }

  const payMaintenance = cost => {
    setBalance(getBalance() - cost)
    addExpenses('maintenance', cost)
  }

  const payFine = () => {
    setBalance(getBalance() - FINE)
    addExpenses('fines', FINE)
  }

  const start = () => {
    if (!interval) {
      interval = setInterval(nextDay, DURATION_PER_DAY)
    }
  }

  const stop = () => {
    clearInterval(interval)
    interval = null
  }

  return { initCompanyState, addProceeds, payBuildingCosts, getDate, getBalance, getExpenses, getFutureDate, payFine, payMaintenance, start, stop }
})()

module.exports = GameManager
