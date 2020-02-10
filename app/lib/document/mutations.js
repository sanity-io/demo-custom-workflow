import client from 'part:@sanity/base/client'

const LISTEN_OPTIONS = {
  events: ['welcome', 'mutation', 'reconnect'],
  includeResult: false,
  visibility: 'query'
}

export function getDocumentMutations$(filter, params = {}, opts) {
  return client.listen(`*[${filter}]`, params, opts || LISTEN_OPTIONS)
}
