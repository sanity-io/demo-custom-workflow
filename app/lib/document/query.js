import sanityClient from 'part:@sanity/base/client'
import {defer} from 'rxjs'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export function getDocumentQuery$(query, params = {}) {
  return defer(() => client.observable.fetch(query, params))
}
