import userDatastore from 'part:@sanity/base/user'
import {defer, from} from 'rxjs'

export function getUser(userId) {
  return userDatastore.getUser(userId)
}

export function getUser$(userId) {
  return defer(() => from(getUser(userId)))
}
