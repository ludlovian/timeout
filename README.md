# timeout
Wraps a promise in a timeout

## timeout(Promise [, ms]) => Promsie

Available as a named export and the default

Arguments:
- `promise` - the promise to wrap
- `ms` - milliseconds after which the promise will be rejected

If no `ms` is provided, then no timeout will be added

If it times out, the returned promise (and the wrapped one)
will be given an extra property `._timedOut` set to `true`

The returned promise will reject with a `TimeoutError`

## TimeoutError

available as a named export, and as `timeout.TimeoutError`
