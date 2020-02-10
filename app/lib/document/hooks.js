import {getLatestDocumentPreview$} from './preview'
import {useObservable} from '../utils/use'

export function useLatestDocumentPreview(id, typeName) {
  const latestPreview$ = getLatestDocumentPreview$(id, typeName)

  return useObservable(latestPreview$, null, [id, typeName])
}
