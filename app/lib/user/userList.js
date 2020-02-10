import userDatastore from 'part:@sanity/base/user'
import {defer, from} from 'rxjs'

export function getUserList$(userIds) {
  return defer(() => from(userDatastore.getUsers(userIds)))
}
