import {observePaths} from 'part:@sanity/base/preview'
import {get} from 'lodash'
import schema from 'part:@sanity/base/schema'
import {combineLatest} from 'rxjs'
import {map} from 'rxjs/operators'

const DEFAULT_SELECT = {
  title: 'title',
  subtitle: 'subtitle',
  description: 'description',
  media: 'media'
}

function getPreviewFieldPaths(type) {
  const select = (type.preview && type.preview.select) || DEFAULT_SELECT

  return Object.keys(select).map(key => select[key].split('.'))
}

function preparePreviewData(type, value) {
  if (!value) return null

  const select = (type.preview && type.preview.select) || DEFAULT_SELECT
  const selectKeys = Object.keys(select)

  return selectKeys.reduce(
    (acc, selectKey) => {
      acc[selectKey] = get(value, select[selectKey])
      return acc
    },
    {_rev: value._rev}
  )
}

export function getDocumentPreview$(id, typeName) {
  const initialValue = {_id: id, _type: typeName}
  const type = schema.get(typeName)
  const previewFieldPaths = getPreviewFieldPaths(type)

  return observePaths(initialValue, previewFieldPaths).pipe(
    map(data => preparePreviewData(type, data))
  )
}

export function getLatestDocumentPreview$(id, typeName) {
  const draftPreview$ = getDocumentPreview$(`drafts.${id}`, typeName)
  const publishedPreview$ = getDocumentPreview$(id, typeName)

  const preview$ = combineLatest(draftPreview$, publishedPreview$).pipe(
    map(([draft, published]) => draft || published)
  )

  return preview$
}
