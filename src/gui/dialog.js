const { start, stop } = require('../gameManagement/gameManager')

const Dialog = (() => {
  const md = document.getElementById('dialog-overlay')
  const t = document.getElementById('modal-dialog-title')
  const b = document.getElementById('modal-dialog-body')
  const btns = document.getElementById('modal-dialog-buttons')

  const openDialog = (title, text, options = []) => {
    stop()
    t.innerText = title
    b.innerText = text
    while (btns.firstChild) {
      btns.removeChild(btns.firstChild)
    }
    options.forEach(optn => {
      addButton(optn[0], optn[1], optn[2])
    })
    md.classList.remove('hidden')
  }

  const closeDialog = () => {
    md.classList.add('hidden')
    start()
  }

  const addButton = (text, cb, closeAfter = false) => {
    const btn = document.createElement('div')
    btn.innerHTML = `<div class="dialog-button bevel">${text}</div>`
    btns.appendChild(btn)
    if (closeAfter) {
      btn.addEventListener('click', () => {
        cb()
        closeDialog()
      })
    } else {
      btn.addEventListener('click', cb || closeDialog)
    }
  }

  return { openDialog, closeDialog }
})()

module.exports = Dialog
