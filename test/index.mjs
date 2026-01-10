import { suite, test } from 'node:test'
import assert from 'node:assert/strict'

import timeout from '../src/index.mjs'

suite('timeout', async () => {
  test('copes with promise that fulfils', async t => {
    const exp = 17
    const fn = t.mock.fn(() => exp)
    const ms = 500

    const prom = Promise.resolve().then(fn)

    const start = Date.now()
    const act = await timeout(prom, ms)
    const end = Date.now()

    assert.strictEqual(fn.mock.callCount(), 1, 'promise was resolved')
    assert.strictEqual(act, exp, 'resolved value passed through')
    assert.ok(end - start < 100, 'Didnt time out')
  })

  test('copes with promise that rejects', async t => {
    const err = new Error('oops')
    const fn = () => Promise.reject(err)
    const ms = 500

    const prom = Promise.resolve().then(fn)

    const start = Date.now()
    await assert.rejects(
      timeout(prom, ms),
      e => e === err,
      'Should pass through rejection'
    )
    const end = Date.now()

    assert.ok(end - start < 100, 'Didnt time out')
  })

  test('times out a promise', async t => {
    const ms = 50
    const p1 = new Promise(() => {}) // never resolves
    const { TimeoutError } = timeout

    const start = Date.now()
    const p2 = timeout(p1, ms)
    await assert.rejects(
      p2,
      e => {
        assert.ok(e instanceof TimeoutError, 'is an instance of right class')
        assert.ok(e.name === 'TimeoutError', 'right name set')
        assert.ok(e.message === 'Timed out', 'right message set')
        assert.ok(p1._timedOut === true, 'flag set on wrapped promise')
        assert.ok(p2._timedOut === true, 'flag set on wrapper promise')
        return true
      },
      'Should throw timeout error'
    )
    const end = Date.now()

    assert.ok(end - start > 40, 'should time out')
  })
})
