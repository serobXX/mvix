import React from 'react'
import PropTypes from 'constants/propTypes'

import { SideModal } from 'components/modals'
import TwoColumnLayout from 'components/TwoColumnLayout'

const TwoColumnLayoutModal = ({
  width,
  title,
  closeLink,
  leftSideCard,
  rightSideCard,
  children
}) => {
  return (
    <SideModal
      width={width}
      title={title}
      closeLink={closeLink}
      displayOverflow
    >
      <TwoColumnLayout
        leftSideCard={leftSideCard}
        rightSideCard={rightSideCard}
        children={children}
      />
    </SideModal>
  )
}

TwoColumnLayoutModal.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string,
  title: PropTypes.string,
  closeLink: PropTypes.string.isRequired,
  leftSideCard: PropTypes.shape({
    title: PropTypes.string,
    component: PropTypes.object.isRequired,
    rootClassName: PropTypes.string
  }),
  rightSideCard: PropTypes.shape({
    title: PropTypes.string,
    rootClassName: PropTypes.string
  })
}

TwoColumnLayoutModal.defaultProps = {
  width: '70%',
  title: '',
  helpPageName: '',
  leftSideCard: {
    title: '',
    dropdown: false,
    icon: false,
    rootClassName: ''
  },
  rightSideCard: {
    title: '',
    dropdown: false,
    icon: false,
    rootClassName: ''
  }
}

export default TwoColumnLayoutModal
