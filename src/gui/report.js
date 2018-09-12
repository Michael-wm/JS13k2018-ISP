const { getEnergyConsumption, getOnlineHouseholds } = require('../elementDefinitions')
const { getDate } = require('../gameManagement/gameManager')

const createDateHeader = date => `${date.toLocaleString('en-us', { month: 'long' })} ${date.getFullYear()}`

const calculateEarnings = (c, e) => {
  return c - e
}

const showReport = () => {
  const contracts = getOnlineHouseholds().length * PROCEEDS_PER_HOUSEHOLD
  const electricity = getEnergyConsumption()

  document.getElementById('report-heading').innerText = `Report for ${createDateHeader(new Date(getDate()))}`
  document.getElementById('report-contracts').innerText = `Proceeds from Contracts: ${contracts}`
  document.getElementById('report-electricity').innerText = `Electricity Costs: ${electricity}`
  document.getElementById('report-earnings').innerText = `Estimated Earnings: ${calculateEarnings(contracts, electricity)}`
}

module.exports = {
  showReport
}
