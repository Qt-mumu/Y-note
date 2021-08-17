/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
function _throttle(fn, time) {
  let last
  let timer
  const interval = time || 200
  return function() {
    const th = this
    const args = arguments
    const now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fn.apply(th, args)
      }, interval)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}
// 防抖
function _debounce(fn, wait) {
  const delay = wait || 200
  var timer
  return function() {
    const th = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}

export {_throttle, _debounce};