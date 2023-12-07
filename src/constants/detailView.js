import { _capitalize } from 'utils/lodash'
import { customFieldTypes } from './customFields'
import { SCREEN_MAX_WIDTH } from './ui'

export const profileCardEditors = {
  topChip: 'topChip',
  title: 'title',
  subTitle: 'subTitle',
  list: 'list',
  footer: 'footer',
  beforeTitleList: 'beforeTitleList'
}

export const GRID_COLS = 5
export const GRID_WIDTH = SCREEN_MAX_WIDTH + 50
export const GRID_ROW_HEIGHT = 10
export const GRID_MARGIN = 15

export const defaultOwner = {
  first_name: 'A',
  last_name: 'Jay',
  id: 1
}

export const DEFAULT_LEAD_TITLE = 'New Lead'

export const defaultCustomFieldLayout = name => ({
  type: customFieldTypes.text,
  name: _capitalize((name || '').replaceAll('-', ' ').replaceAll('_', ' ')),
  code: name
})
