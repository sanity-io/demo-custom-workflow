import PluginIcon from 'part:@sanity/base/plugin-icon'
import React from 'react'
import {BoardTool} from '../components/boardTool'
import {RouterProvider} from '../lib/router'

function BoardToolRoot(props) {
  return (
    <RouterProvider>
      <BoardTool {...props} />
    </RouterProvider>
  )
}

export default {
  name: 'workflow',
  title: 'Workflow',
  component: BoardToolRoot,
  icon: PluginIcon
}
