import sanityClient from 'part:@sanity/base/client'
import {defer, from} from 'rxjs'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function getProject$(projectId) {
  return defer(() =>
    from(
      client.request({
        uri: `/projects/${projectId}`,
        withCredentials: true
      })
    )
  )
}
