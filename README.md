# timeout
Wraps a promise or async function in a timeout

## timeout(Function | Promise, [ms, [ErrorClass]]) => Function | Promsie
```
import timeout from '@ludlovian/timeout'

wrappedFunction = timeout(fn, ms)
await wrappedFunction(x, y, ...)

await timeout(asyncFn(x, y...), ms, CustomError)
```

Takes three arguments:
- `promiseOrFunction` - either the promise to wrap, or a promise-producing function
- `ms` (optional) - milliseconds after which the promise will be rejected
- `CustomError` (optional) - the error class to use. Will use `timeout.TimeoutError` by default

If a function is provided, then a wrapped async function is returned which will 
apply the timeout on each invocation.
