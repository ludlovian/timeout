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
    const prom = new Promise(() => {}) // never resolves
    const { TimeoutError } = timeout

    const start = Date.now()
    await assert.rejects(
      timeout(prom, ms),
      e => {
        assert.ok(e instanceof TimeoutError, 'is an instance of right class')
        assert.ok(e.name === 'TimeoutError', 'right name set')
        assert.ok(e.message === 'Timed out', 'right message set')
        return true
      },
      'Should throw timeout error'
    )
    const end = Date.now()

    assert.ok(end - start > 40, 'should time out')
  })

  test('times out a promise with a custom error class', async t => {
    class CustomError extends Error {}
    const ms = 50
    const prom = new Promise(() => {}) // never resolves
    const start = Date.now()
    await assert.rejects(
      timeout(prom, ms, CustomError),
      e => {
        assert.ok(e instanceof CustomError, 'instance of custom class')
        assert.ok(e.message, 'Timed out', 'right message set')
        return true
      },
      'Should throw custom timeout error'
    )
    const end = Date.now()

    assert.ok(end - start > 40, 'should time out')
  })

  test('wraps a resolvingfunction', async () => {
    const fn = async (x, y) => x + y
    const ms = 500

    const wrapped = timeout(fn, ms)
    assert.ok(typeof wrapped === 'function', 'it is a function')

    const start = Date.now()
    const act = await wrapped(8, 9)
    const end = Date.now()

    assert.equal(act, 17)
    assert.ok(end - start < 100)
  })

  test('wraps a throwing function', async () => {
    const err = new Error('oops')
    const ms = 500
    const fn = () => {
      throw err
    }

    const wrapped = timeout(fn, ms)
    assert.ok(typeof wrapped === 'function', 'it is a function')

    const start = Date.now()
    await assert.rejects(
      wrapped,
      e => {
        assert.ok(e === err, 'right error passed through')
        return true
      },
      'function rejects'
    )
    const end = Date.now()

    assert.ok(end - start < 100)
  })

  test('wraps a hanging function', async () => {
    const ms = 50
    const fn = () => new Promise(() => {})
    class CustomError extends Error {}

    const wrapped = timeout(fn, ms, CustomError)
    assert.ok(typeof wrapped === 'function', 'it is a function')

    const start = Date.now()
    await assert.rejects(wrapped, e => {
      assert.ok(e instanceof CustomError)
      assert.ok(e.message === 'Timed out')
      return true
    })
    const end = Date.now()

    assert.ok(end - start > 40)
  })
})
