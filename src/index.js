(() => {
  const globals = require('./util/globals')
  Object.getOwnPropertyNames(globals).map(p => { global[p] = globals[p] })

  const { createGamePos, getCanvasPosFromScreenPos, transformGamePosToElementId } = require('./util/helpers')
  const { initGui, manageDialogs, closeFullscreen } = require('./gui/gui')
  const ElementGrid = require('./elementDefinitions')
  const GameManager = require('./gameManagement/gameManager')
  const Grid = require('./gui/grid')
  const Event = require('./util/events')
  const { openDialog } = require('./gui/dialog')
  const { getScrollPos, up, down, left, right, setCnvSize } = require('./gui/scrollHelper')
  const { drawMinimap } = require('./gui/minimap')

  const canvas = document.getElementById('game-canvas')
  const ctx = canvas.getContext('2d')
  const canvasContainer = document.getElementById('canvas-container')

  let GAME_STATE = {
    activeAction: 'CABLE'
  }

  let sp = getScrollPos()

  let hoveredField = null

  const executeCurrentAction = e => {
    e.preventDefault()
    const {activeAction} = GAME_STATE
    const el = ElementGrid.getElements()
    const hovered = el[hoveredField]

    const gamePos = createGamePos(getCanvasPosFromScreenPos(canvas, e.x, e.y, sp))
    if (activeAction === 'DELETE') {
      ElementGrid.deleteElement(gamePos)
    } else if (hovered && hovered.type === 'HUB') {
      ElementGrid.openHubDialog(hoveredField)
    } else {
      ElementGrid.buildElement(gamePos, activeAction)
    }
  }

  function draw () {
    ctx.canvas.width = canvasContainer.offsetWidth
    ctx.canvas.height = canvasContainer.offsetHeight
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(Grid.drawGrid(), sp.x - WORLD_HEIGHT / 2, sp.y - WORLD_WIDTH / 2)
  }

  canvas.addEventListener('click', e => executeCurrentAction(e))
  canvas.addEventListener('mousemove', e => {
    const mousePos = getCanvasPosFromScreenPos(canvas, e.x, e.y, sp)
    hoveredField = transformGamePosToElementId(createGamePos(mousePos.x, mousePos.y))
  })
  window.addEventListener('keydown', e => {
    e.preventDefault()
    switch (e.key) {
      case 'ArrowUp': case 'w':
        up()
        break
      case 'ArrowDown': case 's':
        down()
        break
      case 'ArrowLeft': case 'a':
        left()
        break
      case 'ArrowRight': case 'd':
        right()
        break
    }
  })

  const step = t1 => t2 => {
    if (t2 - t1 > 100) {
      setCnvSize(ctx.canvas.width, ctx.canvas.height)
      sp = getScrollPos()
      draw()
      drawMinimap(ElementGrid.getElements())
      window.requestAnimationFrame(step(t2))
    } else {
      window.requestAnimationFrame(step(t1))
    }
  }

  GameManager.initCompanyState({
    currentDate: new Date(),
    currentBalance: STARTING_BALANCE,
    currentBandwidth: {
      available: 0,
      required: 0,
      supplied: 0
    },
    spawnChance: HOUSE_SPAWN_COOLDOWN
  })
  GameManager.start()

  ElementGrid.buildElement({x: -1, y: -5}, 'HOUSE')
  ElementGrid.buildElement({x: 3, y: 8}, 'HOUSE')
  ElementGrid.buildElement({x: 14, y: 7}, 'HUB')

  initGui(GAME_STATE)
  manageDialogs(GAME_STATE)

  Event.on('GAME_OVER', () => {
    openDialog('Notice', 'We are sorry to inform you that this company just went bankrupt. Thank you for your service and the countless substantial contributions. You can go home now.', [['Exit', () => Event.fire('EXIT')], ['Restart', () => window.location.reload()]])
  })

  Event.on('EXIT', () => {
    GameManager.stop()
    const game = document.getElementById('game')
    game.parentNode.removeChild(game)
    closeFullscreen()
  })

  window.requestAnimationFrame(step(0))
})()
