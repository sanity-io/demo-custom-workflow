import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

const LISTEN_OPTIONS = {
  events: ['welcome', 'mutation', 'reconnect'],
  includeResult: false,
  visibility: 'query'
}

export function getDocumentMutations$(filter, params = {}, opts) {
  return client.listen(`*[${filter}]`, params, opts || LISTEN_OPTIONS)
}
