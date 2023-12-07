import { createContext } from 'react'

const BaseTableContext = createContext({
  statusBarChanged: false,
  setStatusBarChanged: f => f,
  filterPanelOpened: false,
  setFilterPanelOpened: f => f,
  filterChanged: false,
  setFilterChanged: f => f
})

export default BaseTableContext
