import { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import Scrollbars from 'components/Scrollbars'
import Container from 'components/containers/Container'
import { SideTabGroup, UpperTab, UpperTabs } from 'components/tabs'
import PropTypes from 'constants/propTypes'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { customFieldTypes } from 'constants/customFields'
import { parseFromBEData } from 'utils/customFieldUtils'
import { createTab } from 'components/tabs/SideTabGroup'
import { _get } from 'utils/lodash'
import { tagEntityType } from 'constants/tagConstants'
import { getCustomFieldPermissionByGroup } from 'utils/permissionsUtils'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import { permissionTypes } from 'constants/permissionGroups'
import useCustomStaticFields from 'hooks/useCustomStaticFields'

const useStyles = makeStyles(({ palette, type, typography, spacing }) => ({
  root: ({ showTabs }) => ({
    gridTemplateColumns: showTabs ? '1fr 4fr' : '1fr',
    height: '100%',
    gap: 0
  }),
  tabRoot: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  tabs: {
    flexGrow: 2,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  scroller: {
    padding: '55px 0',
    paddingLeft: 25
  },
  tab: {
    opacity: 1,
    height: '50px',
    width: '260px',
    margin: '25px -1px 0'
  },
  selected: {
    color: palette[type].pages.rbac.roles.active.color
  },
  contentRoot: ({ isUpperTab }) => ({
    height: isUpperTab ? 'calc(100% - 48px)' : '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
    flexDirection: 'column'
  }),
  sideModalContent: {
    padding: '16px'
  },
  tabContainer: {
    alignItems: 'flex-end'
  },
  tabWrapper: {
    padding: '0px 20px'
  },
  tabLabel: {
    ...typography.darkAccent[type]
  },
  topBorder: {
    borderTop: `1px solid ${palette[type].sideModal.content.border}`
  },
  fieldRoot: {
    display: 'flex',
    gap: spacing(2),
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    height: '100%'
  },
  gridWrap: {
    height: '100%'
  }
}))

const CustomFieldForm = ({
  fields: layoutFields,
  wrapperClassName,
  rootClassName,
  childrenWrapperClass,
  name = '',
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  showTopBorder,
  permissionGroupName,
  isEdit,
  showAll,
  staticFields: staticFieldComponents,
  staticFieldsOn: staticFieldsOnComponents,
  staticFieldsAtFirst: staticFieldsAtFirstComponents,
  disabled,
  hideTagField,
  hideStatusField,
  tagEntityType,
  staticTabWithComponent,
  isUpperTab,
  cols,
  handleDoubleClick
}) => {
  const [tabs, setTabs] = useState([])
  const [fields, setFields] = useState([])
  const [showTabs, setShowTabs] = useState(false)
  const [selectedTab, setSelectedTab] = useState()

  const readGroups = useUserPermissionGroupsByType(permissionTypes.read)
  const createGroups = useUserPermissionGroupsByType(permissionTypes.create)
  const updateGroups = useUserPermissionGroupsByType(permissionTypes.update)

  const classes = useStyles({ showTabs: showTabs && !isUpperTab, isUpperTab })

  const doubleClick = useCallback(
    name => () => {
      handleDoubleClick(name)
    },
    [handleDoubleClick]
  )

  const { staticFields, staticFieldsAtFirst, staticFieldsOn } =
    useCustomStaticFields({
      hideTagField,
      hideStatusField,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      tagEntityType,
      staticFields: staticFieldComponents,
      staticFieldsAtFirst: staticFieldsAtFirstComponents,
      staticFieldOn: staticFieldsOnComponents,
      disabled,
      handleDoubleClick: doubleClick
    })

  const isAllowed = useCallback(
    (groups, name) =>
      showAll ||
      groups.includes(
        getCustomFieldPermissionByGroup(permissionGroupName, name)
      ),
    [permissionGroupName, showAll]
  )

  useEffect(() => {
    const data = parseFromBEData(layoutFields)

    const firstTab = data.find(({ type }) => type === customFieldTypes.tab)
    let _tabs = staticTabWithComponent.map(
      ({ code, name, sortOrder, tooltip, tooltipType, component }) => ({
        ...createTab(name, code, {
          tooltip,
          tooltipType
        }),
        sortOrder,
        childs: [],
        component
      })
    )

    if (!firstTab && _tabs.length) {
      _tabs = [
        {
          ...createTab('Information', 'information'),
          sortOrder: 1,
          childs: data
        },
        ..._tabs
      ]
    }

    if (firstTab || _tabs.length) {
      setTabs([
        ...(firstTab ? data : [])
          .filter(
            ({ type, name }) =>
              type === customFieldTypes.tab && isAllowed(readGroups, name)
          )
          .map(({ code, name, sortOrder, tooltip, tooltipType, childs }) => ({
            ...createTab(name, code, {
              tooltip,
              tooltipType
            }),
            sortOrder,
            childs: childs
              .filter(
                ({ type }) =>
                  ![customFieldTypes.json, customFieldTypes.internal].includes(
                    type
                  )
              )
              .map(item => ({
                ...item,
                disabled: isEdit
                  ? isAllowed(updateGroups, name)
                  : isAllowed(createGroups, name)
              }))
          })),
        ..._tabs
      ])
      setShowTabs(true)
      if (firstTab) {
        if (!isAllowed(readGroups, firstTab.name)) {
          setSelectedTab()
          setFields([])
        } else {
          setSelectedTab(firstTab.code)
          setFields(firstTab.childs)
        }
      } else {
        setSelectedTab(_tabs?.[0]?.value)
      }
    } else {
      setFields(data)
      setShowTabs(false)
    }
    //eslint-disable-next-line
  }, [layoutFields, readGroups])

  const handleChangeTab = useCallback(
    (_, tab) => {
      setSelectedTab(tab)
      setFields(tabs.find(({ value }) => value === tab)?.childs || [])
    },
    [tabs]
  )

  const staticFieldsOnRender = useCallback(
    code => {
      const field = staticFieldsOn.find(f => f.code === code)
      if (field) {
        return field.render
      }
      return null
    },
    [staticFieldsOn]
  )

  const tabComponent = useMemo(() => {
    const tab = tabs.find(({ value }) => value === selectedTab)
    return tab?.component ? (
      <tab.component
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={disabled}
      />
    ) : null
  }, [
    tabs,
    selectedTab,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    disabled
  ])

  const gridCols = useCallback(
    (width = 1) => {
      if (cols) {
        return width === 0.5 ? 6 / cols : 12 / cols
      }
      return showTabs && !isUpperTab ? 4 * width : 3 * width
    },
    [cols, showTabs, isUpperTab]
  )

  return (
    <Grid container className={classNames(classes.gridWrap, wrapperClassName)}>
      {showTabs && isUpperTab && (
        <UpperTabs value={selectedTab} onChange={handleChangeTab}>
          {tabs.map(({ label, value }) => (
            <UpperTab
              key={`upper-tab-custom-field-${value}`}
              label={label}
              value={value}
              disableRipple
            />
          ))}
        </UpperTabs>
      )}
      <Container
        rootClassName={classNames(classes.root, rootClassName, {
          [classes.topBorder]: showTopBorder
        })}
      >
        {showTabs && !isUpperTab && (
          <SideTabGroup
            tabs={tabs}
            value={selectedTab}
            onChange={handleChangeTab}
          />
        )}
        <Grid container className={classes.contentRoot}>
          <Scrollbars>
            {tabComponent || (
              <Grid
                container
                spacing={2}
                className={classNames(
                  classes.sideModalContent,
                  childrenWrapperClass
                )}
              >
                {(!showTabs || _get(tabs, '0.value') === selectedTab) &&
                  !!staticFieldsAtFirst.length &&
                  staticFieldsAtFirst.map((field, index) => (
                    <Grid
                      item
                      xs={gridCols()}
                      key={`static-field-at-first-${index}`}
                    >
                      {field}
                    </Grid>
                  ))}
                {fields &&
                  fields
                    .filter(
                      ({ type, name }) =>
                        Object.values(customFieldTypes).includes(type) &&
                        isAllowed(readGroups, name)
                    )
                    .map(
                      ({
                        type,
                        name: label,
                        code,
                        lookupType,
                        options,
                        width = 1,
                        tooltip,
                        tooltipType,
                        property
                      }) => (
                        <Grid
                          item
                          xs={gridCols(width)}
                          key={`custom-field-${code}`}
                          className={classes.fieldRoot}
                        >
                          {staticFieldsOnRender(code)}
                          <CustomField
                            type={type}
                            label={label}
                            name={`${name}.${code}`}
                            value={_get(values, `${name}.${code}`, '')}
                            error={_get(errors, `${name}.${code}`, '')}
                            touched={_get(touched, `${name}.${code}`, false)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            lookupType={lookupType}
                            options={options}
                            tooltip={tooltip}
                            tooltipType={tooltipType}
                            disabled={
                              disabled ||
                              (isEdit
                                ? !isAllowed(updateGroups, label)
                                : !isAllowed(createGroups, label))
                            }
                            property={property}
                            onDoubleClick={doubleClick(code)}
                          />
                        </Grid>
                      )
                    )}
                {(!showTabs || _get(tabs, '0.value') === selectedTab) &&
                  !!staticFields.length &&
                  staticFields.map((field, index) => (
                    <Grid item xs={gridCols()} key={`static-field-${index}`}>
                      {field}
                    </Grid>
                  ))}
              </Grid>
            )}
          </Scrollbars>
        </Grid>
      </Container>
    </Grid>
  )
}

CustomFieldForm.propTypes = {
  fields: PropTypes.array,
  rootClassName: PropTypes.className,
  childrenWrapperClass: PropTypes.className,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  showTopBorder: PropTypes.bool,
  showTagField: PropTypes.bool,
  tagEntityType: PropTypes.string,
  showSalutationOn: PropTypes.string,
  staticFields: PropTypes.array,
  staticFieldsOn: PropTypes.array,
  staticFieldsAtFirst: PropTypes.array,
  staticTabWithComponent: PropTypes.array,
  isUpperTab: PropTypes.bool,
  cols: PropTypes.number
}

CustomFieldForm.defaultProps = {
  fields: [],
  values: {},
  errors: {},
  touched: {},
  handleChange: f => f,
  handleBlur: f => f,
  showTopBorder: false,
  showTagField: false,
  tagEntityType: tagEntityType.lead,
  staticFields: [],
  staticFieldsOn: [],
  showAll: false,
  staticFieldsAtFirst: [],
  staticTabWithComponent: [],
  isUpperTab: false
}

export default CustomFieldForm
