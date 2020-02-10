import client from 'part:@sanity/base/client'
import {defer, from} from 'rxjs'

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
