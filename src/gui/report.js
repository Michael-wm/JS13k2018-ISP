const { getEnergyConsumption, getOnlineHouseholds } = require('../elementDefinitions')
const { getDate, getExpenses } = require('../gameManagement/gameManager')

const createDateHeader = date => `${date.toLocaleString('en-us', { month: 'long' })} ${date.getFullYear()}`

const showReport = () => {
  const contracts = getOnlineHouseholds().length * PROCEEDS_PER_HOUSEHOLD
  const electricity = getEnergyConsumption()
  const { construction, fines, maintenance } = getExpenses()
  const profit = contracts - electricity - construction - fines - maintenance

  document.getElementById('report-heading').innerText = `Report for ${createDateHeader(new Date(getDate()))}`
  document.getElementById('report-contracts').innerText = `$${contracts}`
  document.getElementById('report-electricity').innerText = `$${electricity}`
  document.getElementById('report-fines').innerText = `$${fines}`
  document.getElementById('report-construction').innerText = `$${construction}`
  document.getElementById('report-maintenance').innerText = `$${maintenance}`
  document.getElementById('report-earnings').innerText = `$${profit}`
}

module.exports = {
  showReport
}
