import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import moment from 'moment'

import { BlueButton, WhiteButton } from 'components/buttons'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import Icon from 'components/icons/Icon'
import { EmptyPlaceholder } from 'components/placeholder'
import { UpperTab, UpperTabs } from 'components/tabs'
import { createTab } from 'components/tabs/SideTabGroup'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { requiredField } from 'constants/validationMessages'
import CardForm from './CardForm'
import Yup from 'utils/yup'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import ProfileList from '../ProfileCard/ProfileList'

const useStyles = makeStyles(
  ({ palette, type, typography, fontSize, lineHeight, colors }) => ({
    cardRoot: {
      display: 'flex',
      flexDirection: 'column',
      boxShadow: palette[type].pages.dashboard.card.boxShadow,
      '&:hover $copyIcon': {
        opacity: 1,
        visibility: 'visible'
      }
    },
    cardContentRoot: {
      flexGrow: 1
    },
    cardContentWrap: {
      height: '100%',
      flexDirection: 'row'
    },
    gridWrap: {
      height: '100%',
      flexDirection: 'column'
    },
    tabContentRoot: {
      flexGrow: 1,
      padding: '16px 20px',
      background: palette[type].tableLibrary.body.row.background
    },
    addIcon: {
      ...typography.darkText[type],
      fontSize: fontSize.big
    },
    footerRoot: {
      paddingRight: 25,
      gridColumnGap: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      top: 2,
      left: 0,
      background: palette[type].card.background,
      paddingTop: 10,
      paddingBottom: 10
    },
    tabRoot: {
      flexGrow: 1,
      overflow: 'auto'
    },
    hoverOverActionRoot: {
      paddingTop: 5,
      paddingRight: 10,
      background: palette[type].pages.dashboard.card.background
    },
    hoverOverActionButton: {
      color: typography.darkText[type].color,
      transition: '0.3s opacity, 0.3s visibility, 0.3s margin',
      fontSize: '1rem'
    },
    upperTabsRoot: {
      background: palette[type].pages.dashboard.card.background
    },
    upperTabRoot: {
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary,
      '& span': {
        textTransform: 'capitalize !important'
      }
    },
    emptyIcon: {
      color: colors.light
    },
    emptyText: {
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary,
      color: colors.light
    },
    emptyRoot: {
      minHeight: 300
    },
    grayHeader: {
      marginLeft: '-20px',
      marginRight: '-20px',
      backgroundColor: palette[type].pages.dashboard.card.background,
      padding: '10px 9px 10px 20px'
    },
    listRoot: {
      padding: 0
    }
  })
)

const initialValues = {
  date: moment().format(BACKEND_DATE_FORMAT),
  trainedBy: '',
  note: '',
  relatedTo: '',
  dueDate: '',
  subject: '',
  description: '',
  priority: ''
}

const validationSchema = Yup.object().shape({
  date: Yup.string().required(requiredField),
  trainedBy: Yup.number().required(requiredField),
  note: Yup.string().required(requiredField).maxWords(100),
  relatedTo: Yup.number().when('subject', {
    is: subject => !!subject,
    then: () => Yup.number().required(requiredField)
  }),
  dueDate: Yup.string().when('subject', {
    is: subject => !!subject,
    then: () => Yup.string().required(requiredField)
  }),
  subject: Yup.string(),
  description: Yup.string().when('subject', {
    is: subject => !!subject,
    then: () => Yup.string().required(requiredField)
  }),
  priority: Yup.string().when('subject', {
    is: subject => !!subject,
    then: () => Yup.string().required(requiredField)
  })
})

const DemoTrainingBaseCard = ({
  items,
  title,
  onSubmit: submitForm,
  onDeleteItem,
  post,
  put
}) => {
  const classes = useStyles()
  const [tabs, setTabs] = useState([])
  const [selectedTab, setSelectedTab] = useState()
  const [isAdd, setAdd] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [editItem, setEditItem] = useState()
  const initialFormValues = useRef(initialValues)

  const { showConfirmation } = useConfirmation()

  const onSubmit = useCallback(
    values => {
      submitForm({
        ...values,
        id: editItem?.id
      })
    },
    [submitForm, editItem?.id]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setValues
  } = useFormik({
    initialValues: initialFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    setTabs(items.map((_, index) => createTab(`${title} ${index + 1}`, index)))
    //eslint-disable-next-line
  }, [items])

  useEffect(() => {
    if (tabs.length && !selectedTab) {
      setSelectedTab(tabs[0]?.value)
    }
    //eslint-disable-next-line
  }, [tabs])

  useEffect(() => {
    if (editItem) {
      const { date, note, trainedBy, activity } = editItem
      setValues({
        ...initialValues,
        date,
        note,
        trainedBy: trainedBy?.id,
        relatedTo: activity?.relatedTo?.id,
        dueDate: activity?.dueDate,
        subject: activity?.subject,
        description: activity?.description,
        priority: activity?.priority
      })
    }
    //eslint-disable-next-line
  }, [editItem])

  const handleChangeTab = useCallback((_, tab) => {
    setSelectedTab(tab)
  }, [])

  const selectedTabRecords = useMemo(
    () => items?.[selectedTab],
    [items, selectedTab]
  )

  const handleAdd = useCallback(() => {
    setTabs(t => [...t, createTab(`${title} ${t.length + 1}`, t.length)])
    setSelectedTab(tabs.length)
    setAdd(true)
  }, [tabs, title])

  const handleEdit = useCallback(() => {
    setEditItem(selectedTabRecords)
    setEdit(true)
  }, [selectedTabRecords])

  const handleDelete = useCallback(() => {
    showConfirmation(
      getDeleteConfirmationMessage(`${title} ${selectedTab + 1}`),
      () => onDeleteItem(selectedTabRecords?.id)
    )
  }, [showConfirmation, onDeleteItem, selectedTabRecords, title, selectedTab])

  const dropdownItems = useMemo(
    () => [
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        onClick: handleEdit
      },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        onClick: handleDelete
      },
      {
        label: 'Add New',
        icon: getIconClassName(iconNames.add),
        onClick: handleAdd
      }
    ],
    [handleDelete, handleEdit, handleAdd]
  )

  const handleCancel = () => {
    handleReset()
    setEditItem()
    if (isAdd) {
      const _tabs = [...tabs]
      _tabs.splice(_tabs.length - 1, 1)
      setTabs(_tabs)
      setSelectedTab(0)
    }
    setAdd(false)
    setEdit(false)
  }

  useEffect(() => {
    if (post?.isSuccess || put?.isSuccess) {
      handleCancel()
    }
    //eslint-disable-next-line
  }, [post, put])

  const list = useMemo(
    () => [
      {
        value: moment(selectedTabRecords?.date, BACKEND_DATE_FORMAT).format(
          DATE_VIEW_FORMAT
        ),
        icon: getIconClassName(iconNames.date, iconTypes.duotone)
      },
      {
        value: selectedTabRecords?.trainedBy
          ? `${selectedTabRecords.trainedBy.first_name} ${selectedTabRecords.trainedBy.last_name}`
          : '',
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone)
      },
      {
        value: selectedTabRecords?.note,
        icon: getIconClassName(iconNames.note, iconTypes.duotone),
        multiline: true
      }
    ],
    [selectedTabRecords]
  )

  return (
    <>
      <GridCardBase
        dropdown={false}
        title={!tabs.length ? title : ''}
        iconButtonComponent={
          !!tabs.length && (
            <Icon
              icon={getIconClassName(iconNames.gridCardAdd)}
              onClick={handleAdd}
              className={classes.addIcon}
            />
          )
        }
        removeSidePaddings
        removeScrollbar
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        contentWrapClassName={classes.cardContentWrap}
      >
        {!!tabs.length ? (
          <Grid container className={classes.gridWrap}>
            <Grid item container wrap="nowrap">
              <Grid item className={classes.tabRoot}>
                <UpperTabs
                  value={selectedTab}
                  onChange={handleChangeTab}
                  className={classes.upperTabsRoot}
                >
                  {tabs.map(({ label, value }) => (
                    <UpperTab
                      key={`upper-tab-address-${value}`}
                      label={label}
                      value={value}
                      className={classes.upperTabRoot}
                      disableRipple
                    />
                  ))}
                </UpperTabs>
              </Grid>
              <Grid item className={classes.hoverOverActionRoot}>
                <HoverOverDropdownButton
                  iconButtonClassName={classes.hoverOverActionButton}
                  items={dropdownItems}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.tabContentRoot}>
              {isEdit || isAdd ? (
                <CardForm
                  title={title}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  classes={classes}
                />
              ) : (
                <ProfileList
                  list={list}
                  showEditor={() => false}
                  rootClassName={classes.listRoot}
                />
              )}
            </Grid>
          </Grid>
        ) : (
          <EmptyPlaceholder
            text={`No ${title}`}
            requestText={`Click to Add a ${title}`}
            onClick={handleAdd}
            variant="small"
          />
        )}
      </GridCardBase>
      {(isAdd || isEdit) && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            iconClassName={getIconClassName(iconNames.cancel)}
            onClick={handleCancel}
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

export default DemoTrainingBaseCard
