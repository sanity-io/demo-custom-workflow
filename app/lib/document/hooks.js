import {useObservable} from '../utils/use'
import {getLatestDocumentPreview$} from './preview'

export function useLatestDocumentPreview(id, typeName) {
  const latestPreview$ = getLatestDocumentPreview$(id, typeName)

  return useObservable(latestPreview$, null, [id, typeName])
}
