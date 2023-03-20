import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('product').title('Products'),
      S.divider(),
      S.listItem()
      .title('Assigned to me')
      .schemaType('workflow.metadata')
      .child(
        S.documentList()
          .title('Assigned to me')
          .filter('_type == "workflow.metadata" && identity() in assignees')
      ),
      S.documentTypeListItem('workflow.metadata').title('Workflow Metadata'),
  ])