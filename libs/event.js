/**
 * Created by Lynn on 2017/6/22.
 */
const _on = (target, eventName, callback, capture) => {
  'use strict'
  if (target.addEventListener) {
    target.addEventListener(eventName, callback, capture)
  } else if (target.attachEvent) { // IE8+ Support
    target.attachEvent(`on${eventName}`, () => {
      callback.call(target)
    })
  }
}
const _off = (target, eventName, callback, capture) => {
  'use strict'
  if (target.removeEventListener) {
    target.removeEventListener(eventName, callback, capture)
  } else if (target.detachEvent) { // IE8+ Support
    target.detachEvent(`on${eventName}`, callback)
  }
}
export default {
  on: _on,
  off: _off
}
