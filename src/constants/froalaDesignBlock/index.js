import callToAction from './callToAction'
import contacts from './contacts'
import contents from './content'
import features from './features'
import footers from './footers'
import forms from './forms'
import pricings from './pricings'
import teams from './teams'
import testimonials from './testimonials'

export const designBlockCategories = {
  callToAction: 'Call to action',
  contacts: 'Contacts',
  contents: 'Contents',
  features: 'Features',
  footers: 'Footers',
  forms: 'Forms',
  headers: 'Headers',
  pricings: 'Pricings',
  teams: 'Teams',
  testimonials: 'Testimonials'
}

export const designBlockCategoryOptions = [
  ...Object.values(designBlockCategories).map(type => ({
    label: type,
    value: type
  }))
]

export const designBlockList = {
  [designBlockCategories.callToAction]: callToAction,
  [designBlockCategories.contacts]: contacts,
  [designBlockCategories.contents]: contents,
  [designBlockCategories.features]: features,
  [designBlockCategories.footers]: footers,
  [designBlockCategories.forms]: forms,
  [designBlockCategories.pricings]: pricings,
  [designBlockCategories.teams]: teams,
  [designBlockCategories.testimonials]: testimonials
}
