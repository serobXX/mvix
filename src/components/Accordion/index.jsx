import React from 'react'
import MuiAccordion from '@material-ui/core/Accordion'
import withStyles from '@material-ui/core/styles/withStyles'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'

import { Text, ErrorText } from 'components/typography'
import PropTypes from 'constants/propTypes'

function styles({ palette, type, spacing }) {
  return {
    root: {
      width: '100%',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].sideModal.content.border,
      backgroundColor: palette[type].mediaInfo.card.background,
      borderRadius: 4,
      '&:before': {
        display: 'none'
      }
    },
    rootExpanded: {
      margin: '0 !important'
    },
    summary: {
      borderRadius: 3,
      minHeight: 0,
      padding: `${spacing(1)}px ${spacing(2)}px`,
      backgroundColor: palette[type].pages.media.card.header.background,
      '&$summaryExpanded': {
        minHeight: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: palette[type].sideModal.content.border
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
    title: {
      marginRight: spacing(1)
    },
    icon: {
      color: palette[type].mediaInfo.card.expandIconColor
    },
    button: {
      padding: 0
    },
    details: {
      padding: spacing(2)
    }
  }
}

function Accordion({
  classes,
  open,
  initialOpen,
  toggle,
  title,
  children,
  onChange,
  error,
  isOptional,
  headerComponent,
  disabled,
  headerComponentClass,
  contentClass,
  titleClasName,
  summaryContentClassName,
  rootClassName,
  summaryRootClassName
}) {
  return (
    <MuiAccordion
      elevation={0}
      expanded={open}
      onChange={onChange}
      defaultExpanded={initialOpen}
      disabled={disabled}
      classes={{
        root: classNames(classes.root, rootClassName),
        expanded: classes.rootExpanded
      }}
    >
      <AccordionSummary
        classes={{
          root: classNames(classes.summary, summaryRootClassName),
          content: classNames(classes.summaryContent, summaryContentClassName),
          expanded: classes.summaryExpanded
        }}
        onClick={toggle}
        expandIcon={<ExpandMoreIcon className={classes.icon} />}
        IconButtonProps={{
          disableRipple: true,
          classes: {
            root: classes.button
          }
        }}
      >
        {title && (
          <Text
            weight="bold"
            rootClassName={classNames(classes.title, titleClasName)}
          >
            {title}
          </Text>
        )}
        {headerComponent && (
          <Grid className={headerComponentClass} item>
            {headerComponent}
          </Grid>
        )}
        <ErrorText error={error} condition={!!error} isOptional={isOptional} />
      </AccordionSummary>
      <AccordionDetails className={classNames(classes.details, contentClass)}>
        {children}
      </AccordionDetails>
    </MuiAccordion>
  )
}

Accordion.propTypes = {
  open: PropTypes.bool,
  initialOpen: PropTypes.bool,
  toggle: PropTypes.func,
  title: PropTypes.string,
  headerComponent: PropTypes.node,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isOptional: PropTypes.bool
}

export default withStyles(styles)(Accordion)
