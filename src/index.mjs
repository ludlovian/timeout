export default function timeout (p, ms = 5000, _Error = TimeoutError) {
  if (typeof p === 'function') {
    return async (...args) => timeout(p(...args), ms, _Error)
  }

  return new Promise((resolve, reject) => {
    const tm = setTimeout(() => reject(new _Error('Timed out')), ms)
    p.then(resolve, reject).finally(() => clearTimeout(tm))
  })
}

class TimeoutError extends Error {
  constructor () {
    super('Timed out')
  }

  get name () {
    return 'TimeoutError'
  }
}

timeout.TimeoutError = TimeoutError
