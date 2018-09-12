const Minimap = (() => {
  const { transformElementIdToGamePos } = require('../util/helpers')
  const { scrollTo } = require('./scrollHelper')
  const W2 = WORLD_HEIGHT / 20
  const H2 = WORLD_WIDTH / 20
  const S = 3
  let cnv = document.getElementById('minimap-cnv')
  let ctx = null

  const colors = {
    HUB: {
      active: '#00ff00',
      defective: '#ffbb00',
      destroyed: '#ff0000'
    },
    HOUSE: {
      online: '#00ff00',
      slow: '#ffbb00',
      offline: '#ff0000',
      pending: '#ff0000'
    }
  }

  const drawMinimap = e => {
    if (ctx === null) {
      ctx = cnv.getContext('2d')
    }
    Object.keys(e).forEach(id => {
      if (e[id].type !== 'CABLE') {
        const { x, y } = transformElementIdToGamePos(id)
        ctx.fillStyle = colors[e[id].type][e[id].status]
        if (e[id].type === 'HUB') {
          ctx.fillRect((x - S) * S + W2 + 1, (y - S) * S + H2, 1, S)
          ctx.fillRect((x - S) * S + W2, (y - S) * S + H2 + 1, S, 1)
        } else {
          ctx.fillRect((x - S) * S + W2, (y - S) * S + H2, S, S)
        }
      }
    })
  }

  cnv.addEventListener('click', e => {
    const target = {
      x: Math.floor(e.layerX / 3) - 50,
      y: Math.floor(e.layerY / 3) - 50
    }
    scrollTo(target)
  })

  return { drawMinimap }
})()

module.exports = Minimap
