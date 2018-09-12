/**
 * SpawnManager
 */

module.exports = (() => {
  const { random, transformElementIdToGamePos } = require('../util/helpers')
  let areas = {}
  let range = 10

  const getId = (x, y) => x + '_' + y

  const resetAreas = () => {
    for (let x = -range; x < range; x += 10) {
      for (let y = -range; y < range; y += 10) {
        areas[getId(x, y)] = 0
      }
    }
  }

  const sortAreas = () => Object.keys(areas).sort((a, b) => areas[a] < areas[b] ? -1 : 1)

  const getPosition = area => {
    const { x, y } = transformElementIdToGamePos(area)
    return {
      x: random(x, x + 10),
      y: random(y, y + 10)
    }
  }

  const findSpawnPoint = e => {
    resetAreas()
    Object.keys(e).forEach(el => {
      if (e[el].type === 'HOUSE') {
        const p = transformElementIdToGamePos(el)
        const x = Math.floor(p.x / 10) * 10
        const y = Math.floor(p.y / 10) * 10
        const id = getId(x, y)
        if (areas.hasOwnProperty(id)) {
          areas[id]++
        }
      }
    })
    const area = sortAreas()[0]
    return getPosition(area)
  }

  const widenSpawnRange = r => { range = r }

  return { findSpawnPoint, widenSpawnRange }
})()
