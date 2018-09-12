const { getOppositeDirection, getIdInDirection, isNeighbour } = require('./helpers')

const pathDetection = (elements) => {
  const findHub = (houseId, hubId) => {
    let stepsObj = { stepsArr: [[houseId]], stepsIndex: {} }
    stepsObj.stepsIndex[houseId] = { step: 0, fromDirection: '' }
    let currStep = 1

    while (!stepsObj.stepsIndex.hasOwnProperty(hubId) && stepsObj.stepsArr[currStep - 1].length) {
      stepsObj.stepsArr.push([])
      stepsObj.stepsArr[currStep - 1].forEach(fieldId => getPossibleSteps(fieldId, currStep, stepsObj))
      currStep++
      if (currStep > MAX_HUB_RANGE) {
        return []
      }
    }

    return getOptimalPath(stepsObj.stepsArr, houseId, hubId)
  }

  const getPossibleSteps = (fieldId, currStep, stepsObj) => {
    const currElement = elements[fieldId]
    const possibleSteps = []
    if (currElement) {
      currElement.connections.forEach(direction => {
        if (stepsObj.stepsIndex[fieldId].fromDirection === direction) return
        const neighbourId = getIdInDirection(fieldId, direction)
        if (!stepsObj.stepsIndex.hasOwnProperty(neighbourId)) {
          stepsObj.stepsIndex[neighbourId] = {step: currStep, fromDirection: getOppositeDirection(direction)}
          possibleSteps.push(neighbourId)
        }
      })
      stepsObj.stepsArr[currStep] = stepsObj.stepsArr[currStep].concat(possibleSteps)
    }
  }

  const getOptimalPath = (stepsArr, beginning, target) => {
    const pathArray = [target]
    let stepCount = stepsArr.length - 1
    let match = target

    while (stepCount > 0 && pathArray[0] !== undefined) {
      stepCount--
      match = stepsArr[stepCount].find(step => isNeighbour(step, pathArray[0]))
      if (match === beginning) {
        return pathArray
      } else {
        pathArray.unshift(match)
      }
    }
    return []
  }

  return findHub
}

module.exports = {
  pathDetection
}
