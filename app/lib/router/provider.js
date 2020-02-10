import React from 'react'
import {internalRouterContextTypeCheck} from './internalRouterContextTypeCheck'

export const RouterContext = React.createContext(null)

export class RouterProvider extends React.Component {
  static contextTypes = {
    __internalRouter: internalRouterContextTypeCheck
  }

  render() {
    const router = this.context.__internalRouter

    return <RouterContext.Provider value={router}>{this.props.children}</RouterContext.Provider>
  }
}
