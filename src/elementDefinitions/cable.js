const s = require('../assets/sprites')

const createCable = ({ connections }) => {
  return {
    type: 'CABLE',
    connections,
    image: s.CABLE(connections)
  }
}

const setImage = c => {
  c.image = s.CABLE(c.connections)
}

const manageCable = elements => c => {
  let fnArray = []
  //fnArray.push(setImage.bind(elements, c))
  return fnArray
}

module.exports = {
  createCable,
  manageCable
}
