const postMessage = (title, message, action, callback, type = '') => {
  const messageWindow = document.getElementById('messages-list')
  const messageEl = document.createElement('div')
  messageEl.classList.add('message')
  messageEl.innerHTML = `<div class="message-title ${'-' + type}">${title}</div><div class="message-body">${message}</div>${action ? `<div class="message-action">${action}</div>` : ''}`
  messageWindow.prepend(messageEl)
  if (action) {
    messageEl.addEventListener('click', callback)
  }
}

module.exports = {
  postMessage
}
