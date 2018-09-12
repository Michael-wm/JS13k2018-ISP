/**
 * Event-System by wildlyinaccurate
 * https://gist.github.com/wildlyinaccurate/3209556
 */

const Event = (function () {
  this.queue = {}
  this.fired = []

  return {
    fire: (event) => {
      const queue = this.queue[event]

      if (typeof queue === 'undefined') {
        return
      }

      for (let i = 0, len = queue.length; i < len; i++) {
        queue[i]()
      }

      this.fired[event] = true
    },

    on: (event, callback) => {
      if (this.fired[event] === true) {
        return callback()
      }

      if (typeof this.queue[event] === 'undefined') {
        this.queue[event] = []
      }

      this.queue[event].push(callback)
    }

  }
})()

module.exports = Event
