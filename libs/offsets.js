/******************************************
 *  Author : wangjianliang
 *  Created On : Fri Jun 09 2017
 *  File : offset.js
 *******************************************/

const offset = (element) => {
  const boundingClientRect = element.getBoundingClientRect()
  return {
    width: boundingClientRect.width || element['offsetWidth'],
    height: boundingClientRect.height || element['offsetHeight'],
    offsetTop: boundingClientRect.top,
    offsetLeft: boundingClientRect.left,
    top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
    left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
  }
}
const getPagearea = (w = window) => {
  if (w.innerWidth != null) {
    return {width: w.innerWidth, height: w.innerHeight}
  }
  var d = w.document
  if (document.compatMode === 'CSS1Compat') {
    return {width: d.documentElement.clientWidth, height: d.documentElement.clientHeight}
  }
  return {width: d.body.clientWidth, height: d.body.clientHeight}
}
const getScroll = (target, top) => {
  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'
  let ret = target[prop]
  if (typeof ret !== 'number') {
    ret = window.document.documentElement[method]
  }
  return ret
}
const showCoords = (event = window.event, type) => {
  if (type === 'touch' || event.changedTouches) {
    event = (event.changedTouches && event.changedTouches[0]) ||
      (event.originalEvent && event.originalEvent.changedTouches &&
      event.originalEvent.changedTouches[0]) ||
      event.originalEvent || event
  }
  const x = event.pageX || (event.clientX +
    (document.documentElement.scrollLeft || document.body.scrollLeft))
  const y = event.pageY || (event.clientY +
    (document.documentElement.scrollTop || document.body.scrollTop))
  return {'x': x, 'y': y}
}
export default {
  offset: offset,
  getScroll: getScroll,
  showCoords: showCoords,
  getPagearea: getPagearea
}
