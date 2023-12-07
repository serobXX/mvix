export const opportunityStageColors = {
  Qualification: {
    background: 'rgb(219, 222, 227)',
    color: 'rgb(50, 58, 69)'
  },
  'Needs Analysis': {
    background: 'rgb(254, 235, 141)',
    color: 'rgb(127, 107, 0)'
  },
  'Value Proposition': {
    background: 'rgb(177, 184, 247)',
    color: 'rgb(64, 70, 124)'
  },
  'Closed Lost': {
    background: 'rgb(240, 168, 180)',
    color: 'rgb(122, 31, 47)'
  },
  'Identify Decision Makers': {
    background: 'rgb(204, 217, 255)',
    color: 'rgb(42, 54, 91)'
  },
  'Closed Won': {
    background: 'rgb(204, 231, 159)',
    color: 'rgb(81, 115, 26)'
  },
  'Proposal/Price Quote': {
    background: 'rgb(191, 179, 238)',
    color: 'rgb(78, 44, 218)'
  },
  'Negotiation/Review': {
    background: 'rgb(102, 153, 204)',
    color: 'rgb(255, 255, 255'
  },
  'Closed-Lost to Competition': {
    background: 'rgb(235, 208, 171)',
    color: 'rgb(215, 126, 0)'
  }
}

export const opportunityTypeValues = {
  existingBusiness: 'Existing business',
  newBusiness: 'New business'
}

export const opportunityTypeOptions = Object.values(opportunityTypeValues).map(
  value => ({
    label: value,
    value
  })
)

export const CLOSED_WON = 'Closed Won'
export const CLOSED_LOST = 'Closed Lost'

export const porposalStatusTypes = {
  created: 'Created',
  sent: 'Sent',
  opened: 'Opened',
  accepted: 'Accepted',
  declined: 'Declined'
}
