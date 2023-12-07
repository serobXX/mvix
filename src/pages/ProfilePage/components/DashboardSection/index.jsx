import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { BlueButton } from 'components/buttons'
import CancelButton from 'components/buttons/CancelButton'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import { CheckboxSwitcher } from 'components/formControls'
import Icon from 'components/icons/Icon'
import { TextWithTooltip } from 'components/typography'
import iconNames from 'constants/iconNames'
import { useCallback, useEffect, useState } from 'react'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type }) => ({
  scrollbarRoot: {
    height: '305px !important'
  },
  rowRoot: {
    display: 'flex',
    borderBottom: `1px solid ${palette[type].pages.accountSettings.clientDetails.row.border}`,
    borderRight: `1px solid ${palette[type].pages.accountSettings.clientDetails.row.border}`,
    padding: '6px 0px',
    alignItems: 'center',
    width: '100%',
    height: 60
  },
  titleRoot: {
    flexGrow: 1,
    padding: '5px 10px 0px 15px',
    overflow: 'hidden'
  },
  lastRowRoot: {
    borderBottom: 'none'
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 10,
    paddingBottom: 6
  }
}))

const dashboardSectionList = [
  {
    label: 'Marketing',
    value: 'Marketing'
  },
  {
    label: 'Sales & Revenue',
    value: 'SalesRevenue'
  },
  {
    label: 'Account Receivables',
    value: 'AccountReceivables'
  },
  {
    label: 'Production',
    value: 'Production'
  },
  {
    label: 'Shipping',
    value: 'Shipping'
  }
]

const DashboardSection = ({ user, onUpdateUser, isFaded }) => {
  const classes = useStyles()
  const [isEdit, setEdit] = useState(false)
  const [values, setValues] = useState(
    dashboardSectionList.reduce((a, b) => {
      a[b.value] = false
      return a
    }, {})
  )

  useEffect(() => {
    if (user?.dashboardBlocks) {
      setValues(val => ({
        ...val,
        ...user?.dashboardBlocks
      }))
    }
  }, [user?.dashboardBlocks])

  const handleToggle = useCallback(({ target: { name, value } }) => {
    setValues(val => ({
      ...val,
      [name]: value
    }))
  }, [])

  const handleCancel = () => {
    setEdit(false)
    if (user?.dashboardBlocks) {
      setValues(val => ({
        ...val,
        ...user?.dashboardBlocks
      }))
    }
  }

  const handleSubmit = () => {
    onUpdateUser({
      dashboardBlocks: values
    })
    setEdit(false)
  }

  return (
    <>
      <GridCardBase
        title={'Dashboard Sections'}
        dropdown={false}
        removeSidePaddings={true}
        scrollbarRootClassName={classes.scrollbarRoot}
        icon={!isEdit}
        isFaded={!isEdit && isFaded}
        iconButtonComponent={
          <Icon
            icon={getIconClassName(iconNames.edit3)}
            color="light"
            onClick={() => setEdit(true)}
          />
        }
      >
        {dashboardSectionList.map(({ label, value }, index) => (
          <div
            className={classNames(classes.rowRoot, {
              [classes.lastRowRoot]: dashboardSectionList.length === index + 1
            })}
            key={`dashboard-sections-${value}`}
          >
            <div className={classes.titleRoot}>
              <TextWithTooltip
                maxWidth={200}
                color={values[value] && isEdit ? 'title.primary' : undefined}
              >
                {label}
              </TextWithTooltip>
            </div>

            <CheckboxSwitcher
              name={value}
              value={values[value]}
              onChange={handleToggle}
              disabled={!isEdit}
            />
          </div>
        ))}
      </GridCardBase>
      {isEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <CancelButton onClick={handleCancel} />
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
            disabled={!Object.values(values).some(v => v)}
          >
            {'Save'}
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default DashboardSection
