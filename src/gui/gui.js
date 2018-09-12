const GUI = (() => {
  const Event = require('../util/events')
  const GameManager = require('../gameManagement/gameManager')
  const { showReport } = require('./report')
  const { openDialog } = require('./dialog')

  const initGui = state => {
    const guiElements = document.getElementById('build-elements').getElementsByClassName('menu-button')

    applyFunctionToCollection(guiElements, element => {
      element.addEventListener('click', () => {
        applyFunctionToCollection(guiElements, removeActive)
        element.classList.add('-active')
        state.activeAction = element.dataset.elementType
      })
    })

    document.getElementById('fullscreen').addEventListener('click', () => {
      if (!document.webkitCurrentFullScreenElement) {
        fullscreen(document.documentElement)
      } else {
        closeFullscreen()
      }
    })

    document.getElementById('exit').addEventListener('click', () => {
      openDialog('Exit Management Center', 'Do You want to exit the management center?', [
        ['Exit', () => Event.fire('EXIT')],
        ['Restart', () => window.location.reload()],
        ['Continue', null]])
    })

    const drawBalance = () => { document.getElementById('balance-info').innerText = `Balance: $${GameManager.getBalance()}` }
    const drawDate = () => { document.getElementById('date-info').innerText = GameManager.getDate() }

    Event.on('UPDATE_BALANCE', drawBalance)
    Event.on('NEXT_DAY', drawDate)
    Event.on('NEXT_DAY', showReport)

    drawBalance()
    drawDate()
    showReport()
  }

  const manageDialogs = () => {
    const dialogs = document.getElementsByClassName('dialog')
    const dialogButtons = document.getElementsByClassName('open-dialog')
    applyFunctionToCollection(dialogs, addCloseEvent)
    applyFunctionToCollection(dialogButtons, openInfoDialog)
  }

  const openInfoDialog = dialogBtn => {
    const gameMain = document.getElementById('game-main')
    const dialogTarget = dialogBtn.getAttribute('data-dialog-type')

    dialogBtn.addEventListener('click', () => {
      gameMain.classList.toggle('-with-' + dialogTarget.toLowerCase())
    })
  }

  const addCloseEvent = domElement => {
    const closeButton = domElement.getElementsByClassName('button')[0]
    const closeTarget = domElement.getAttribute('data-dialog-type')
    const gameMain = document.getElementById('game-main')

    closeButton.addEventListener('click', () => {
      gameMain.classList.remove('-with-' + closeTarget.toLowerCase())
    })
  }

  const fullscreen = e => {
    if (e.requestFullscreen) {
      e.requestFullscreen()
    } else if (e.mozRequestFullScreen) {
      e.mozRequestFullScreen()
    } else if (e.webkitRequestFullscreen) {
      e.webkitRequestFullscreen()
    } else if (e.msRequestFullscreen) {
      e.msRequestFullscreen()
    }
  }

  const closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  const applyFunctionToCollection = (col, fn) => Array.from(col).forEach(fn)
  const removeActive = e => e.classList.remove('-active')

  return { initGui, manageDialogs, closeFullscreen }
})()

module.exports = GUI
