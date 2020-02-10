import config from 'config:sanity'
import {useObservable} from '../utils/use'
import {getProject$} from './project'

export function useProject(projectId) {
  const source = getProject$(projectId)
  const initialValue = null
  const keys = [projectId]

  return useObservable(source, initialValue, keys)
}

export function useCurrentProject() {
  const projectId = config.api.projectId
  const source = getProject$(projectId)
  const initialValue = null
  const keys = [projectId]

  return useObservable(source, initialValue, keys)
}
