import {useContext} from 'react'
import {RouterContext} from './provider'

export function useRouter() {
  return useContext(RouterContext)
}

export function useIntentLink(name, params) {
  const router = useRouter()
  const href = router.resolveIntentLink(name, params)

  const onClick = event => {
    if (event) event.preventDefault()
    router.navigateUrl(href)
  }

  return {href, onClick}
}
