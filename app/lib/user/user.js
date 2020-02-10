import userDatastore from 'part:@sanity/base/user'
import {defer, from} from 'rxjs'
import {filter, map} from 'rxjs/operators'

export function getCurrentUser$() {
  return userDatastore.currentUser.pipe(
    filter(event => event.type === 'snapshot'),
    map(({user}) => user)
  )
}

export function getUser(userId) {
  return userDatastore.getUser(userId)
}

export function getUser$(userId) {
  return defer(() => from(getUser(userId)))
}
