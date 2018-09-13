const s = require('../assets/sprites')

const createCable = ({ connections }) => {
  return {
    type: 'CABLE',
    connections,
    image: s.CABLE(connections)
  }
}

const manageCable = elements => c => []

module.exports = {
  createCable,
  manageCable
}
