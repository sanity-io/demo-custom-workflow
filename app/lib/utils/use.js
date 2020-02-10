import {useEffect, useState} from 'react'

export function useObservable(stream, initialState = null, keys = []) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const sub = stream.subscribe(setState)
    return () => sub.unsubscribe()
  }, keys)

  return state
}
