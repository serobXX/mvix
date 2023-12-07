import React, { useCallback, useEffect, useState } from 'react'
import MuiAccordion from '@material-ui/core/Accordion'
import withStyles from '@material-ui/core/styles/withStyles'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'

import PropTypes from 'constants/propTypes'
import { FormControlCheckbox } from 'components/formControls'
import classNames from 'classnames'

function styles({ typography, type }) {
  return {
    root: {
      width: '100%',
      border: 'none',
      backgroundColor: 'transparent',
      '&:before': {
        display: 'none'
      }
    },
    rootExpanded: {
      margin: '0 !important'
    },
    summary: {
      minHeight: 0,
      padding: 0,
      backgroundColor: 'transparent',
      '&$summaryExpanded': {
        minHeight: 0,
        border: 'none'
      }
    },
    summaryContent: {
      alignItems: 'center',
      minHeight: 0,
      margin: 0,
      '&$summaryExpanded': {
        margin: 0,
        minHeight: 0
      }
    },
    summaryExpanded: {
      margin: 0
    },
    button: {
      padding: 0
    },
    details: {
      padding: '16px 10px 0px 35px'
    },
    checkboxLabel: {
      ...typography.darkText[type]
    }
  }
}

function CheckboxAccordion({
  classes,
  initialOpen,
  title,
  children,
  onChange,
  disabled
}) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (initialOpen) {
      setChecked(initialOpen)
    }
  }, [initialOpen])

  const handleChange = useCallback(
    _checked => {
      setChecked(_checked)
      onChange(_checked)
    },
    [onChange]
  )

  return (
    <MuiAccordion
      elevation={0}
      expanded={checked}
      disabled={disabled}
      classes={{ root: classes.root, expanded: classes.rootExpanded }}
    >
      <AccordionSummary
        classes={{
          root: classes.summary,
          content: classes.summaryContent,
          expanded: classes.summaryExpanded
        }}
        expandIcon={null}
        IconButtonProps={{
          disableRipple: true,
          classes: {
            root: classes.button
          }
        }}
      >
        <FormControlCheckbox
          label={title}
          value={checked}
          onChange={handleChange}
          disabled={disabled}
          labelClassName={classNames({ [classes.checkboxLabel]: checked })}
        />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {children}
      </AccordionDetails>
    </MuiAccordion>
  )
}

CheckboxAccordion.propTypes = {
  open: PropTypes.bool,
  initialOpen: PropTypes.bool,
  title: PropTypes.string,
  headerComponent: PropTypes.node,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isOptional: PropTypes.bool
}

export default withStyles(styles)(CheckboxAccordion)
