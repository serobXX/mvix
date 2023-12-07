import React, { useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import GridCardBase from '../GridCardBase'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import Spacing from 'components/containers/Spacing'
import { BlueButton, WhiteButton } from 'components/buttons'
import customFieldNames from 'constants/customFieldNames'
import { FroalaWysiwygEditor } from 'components/formControls'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  cardContentWrap: {
    height: '100%',
    flexWrap: 'nowrap'
  },
  hoverOverActionButton: {
    fontSize: '1rem',
    color: typography.darkText[type].color,
    marginRight: '-9px',
    transition: '0.3s opacity, 0.3s visibility'
  },
  text: {
    ...typography.lightText[type],
    color: colors.highlight,

    '& ul': {
      paddingLeft: 20,
      margin: 0
    }
  },
  multilineInput: {
    height: `200px !important`
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 7,
    left: 0,
    background: palette[type].card.background
  },
  editorWrap: {
    cursor: 'default',
    '& .fr-wrapper .fr-element': {
      color: 'rgb(21, 101, 192) !important',
      minHeight: `300px !important`
    },
    '& > .fr-view': {
      background: 'transparent',
      border: 'none',
      color: 'rgb(21, 101, 192)',
      padding: 0
    }
  }
}))

const TermAndConditionCard = ({
  title = 'Term and Conditions',
  text,
  onSubmit,
  name = customFieldNames.termAndCondition,
  onlyEdit,
  isSubmitClick,
  isResetClick
}) => {
  const classes = useStyles()
  const [isEdit, setEdit] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (onlyEdit) {
      setEdit(true)
    }
  }, [onlyEdit])

  useEffect(() => {
    setValue(text)
  }, [text, isEdit])

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        onClick: () => setEdit(true)
      }
    ],
    []
  )

  const handleChange = ({ target: { value } }) => {
    setValue(value)
  }

  const handleSubmit = () => {
    onSubmit({ [name]: value })
    !onlyEdit && setEdit(false)
  }

  useEffect(() => {
    if (isSubmitClick) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      setValue(text)
    }
    //eslint-disable-next-line
  }, [isResetClick])

  return (
    <>
      <GridCardBase
        title={title}
        dropdown={false}
        removeScrollbar
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        contentWrapClassName={classes.cardContentWrap}
        iconButtonComponent={
          <HoverOverDropdownButton
            iconButtonClassName={classes.hoverOverActionButton}
            items={actions}
          />
        }
        icon={!onlyEdit}
      >
        <FroalaWysiwygEditor
          fileName={title}
          value={value}
          onChange={handleChange}
          formControlContainerClass={classes.editorWrap}
          marginBottom={false}
          readOnly={!isEdit}
          hidePlaceholder
        />
      </GridCardBase>
      {isEdit && !onlyEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            iconClassName={getIconClassName(iconNames.cancel)}
            onClick={() => setEdit(false)}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
          >
            Save
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default TermAndConditionCard
