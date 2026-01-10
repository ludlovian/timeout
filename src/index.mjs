export default function timeout (pIn, ms) {
  const pOut = new Promise((resolve, reject) => {
    let tm
    if (ms) {
      tm = setTimeout(() => {
        pIn._timedOut = pOut._timedOut = true
        reject(new TimeoutError())
      }, ms)
    }

    pIn.then(
      result => {
        if (tm) clearTimeout(tm)
        resolve(result)
      },
      reason => {
        if (tm) clearTimeout(tm)
        reject(reason)
      }
    )
  })
  return pOut
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

export { timeout, TimeoutError }
