import { createContext } from 'react'

const SystemDictionaryContext = createContext({
  tabs: [],
  activeTab: '',
  onChangeTab: f => f,
  activeSubtab: '',
  onChangeSubtab: f => f,
  showCommonActions: false,
  setShowCommonActions: f => f,
  commonActions: [],
  setCommonActions: f => f,
  sidePanels: [],
  setSidePanels: f => f
})

export default SystemDictionaryContext
