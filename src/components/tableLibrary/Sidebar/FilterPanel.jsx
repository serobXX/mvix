import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { BlueButton, WhiteButton } from 'components/buttons'
import SplitButton from 'components/buttons/SplitButton'

import Container from 'components/containers/Container'
import { FormControlInput } from 'components/formControls'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import Spacing from 'components/containers/Spacing'
import classNames from 'classnames'
import Scrollbars from 'components/Scrollbars'
import CheckboxAccordion from 'components/Accordion/CheckboxAccordion'
import { simulateEvent } from 'utils/formik'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    padding: 10
  },
  footerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '16px 10px',
    gap: 16,
    borderTop: `1px solid ${palette[type].pages.adminSettings.content.border}`
  },
  containerSpacing: {
    paddingRight: 20
  },
  inputIcon: {
    color: palette[type].pages.rbac.primary
  },
  searchFilterRoot: {
    padding: '14px 12px',
    borderBottom: `1px solid ${palette[type].pages.adminSettings.content.border}`
  },
  formControlContainer: {
    width: 163
  },
  fieldRoot: {
    padding: 10
  }
}))

const FilterPanel = ({
  rootClassName,
  containerClassName,
  cols = 1,
  children,
  onSubmit,
  onReset,
  onSaveFilter,
  saveFilterItem,
  showSearchFilter = false,
  searchFilter,
  onChangeSearchFilter = f => f,
  addExtraBottomSpace = 0,
  filterList,
  onChangeFilter = f => f
}) => {
  const classes = useStyles()
  const [isSaveFilterVisible, setSaveFilterVisible] = useState(false)
  const [saveFilterValues, setSaveFilterValues] = useState({
    name: ''
  })
  const [searchTxt, setSearchTxt] = useState('')

  useEffect(() => {
    if (saveFilterItem) {
      setSaveFilterValues(saveFilterItem)
    } else {
      setSaveFilterValues({ name: '' })
    }
  }, [saveFilterItem])

  const handleSaveFilter = useCallback(() => {
    onSaveFilter &&
      onSaveFilter({
        ...saveFilterValues
      })
  }, [onSaveFilter, saveFilterValues])

  const submitItems = useMemo(
    () => [
      {
        label: 'Filter List',
        icon: getIconClassName(iconNames.search),
        value: 'filterList'
      },
      {
        label: 'Save Filter',
        icon: getIconClassName(iconNames.save),
        value: 'saveFilter'
      }
    ],
    []
  )

  const handleClick = useCallback(
    (_, itemValue) => {
      if (itemValue === 'filterList') onSubmit()
      else if (itemValue === 'saveFilter') handleSaveFilter()
    },
    [onSubmit, handleSaveFilter]
  )

  const handleChangeItem = useCallback(item => {
    if (item.value === 'saveFilter') {
      setSaveFilterVisible(true)
    } else {
      setSaveFilterVisible(false)
    }
  }, [])

  const handleChange = useCallback(
    ({ target: { name: _name, value: _value } }) => {
      setSaveFilterValues({
        [_name]: _value
      })
    },
    []
  )

  const filteredList = useMemo(
    () =>
      (filterList || []).filter(({ label, name }) =>
        (label || camelCaseToSplitCapitalize(name))
          .toLowerCase()
          .includes(searchTxt.toLowerCase())
      ),
    [filterList, searchTxt]
  )

  const handelChangeSearch = ({ target: { value } }) =>
    filterList?.length ? setSearchTxt(value) : onChangeSearchFilter(value)

  return (
    <div className={classNames(classes.root, rootClassName)}>
      {showSearchFilter && (
        <div className={classes.searchFilterRoot}>
          <FormControlInput
            value={filterList?.length ? searchTxt : searchFilter}
            onChange={handelChangeSearch}
            marginBottom={false}
            placeholder="Search Filter"
            endAdornment={
              <i
                className={classNames(
                  getIconClassName(iconNames.search),
                  classes.inputIcon
                )}
              />
            }
            fullWidth
          />
        </div>
      )}
      <Scrollbars
        style={{
          height: `calc(100vh - ${
            (showSearchFilter ? 355 : 288) + addExtraBottomSpace
          }px)`
        }}
      >
        <Spacing variant={3} rootClassName={classes.containerSpacing}>
          <Container cols={cols} rootClassName={containerClassName}>
            {filterList?.length
              ? filteredList.map(
                  ({ label, name, value, filter: Component, props }) => (
                    <div
                      className={classes.fieldRoot}
                      key={`filter-panel-${name}`}
                    >
                      <CheckboxAccordion
                        title={label}
                        initialOpen={!!value}
                        onChange={open =>
                          !open && onChangeFilter(simulateEvent(name, ''))
                        }
                      >
                        <Component
                          name={name}
                          value={value}
                          placeholder={label}
                          onChange={onChangeFilter}
                          {...(props || {})}
                          marginBottom={false}
                          fullWidth
                        />
                      </CheckboxAccordion>
                    </div>
                  )
                )
              : children}
          </Container>
        </Spacing>
      </Scrollbars>
      <div className={classes.footerContainer}>
        {!isSaveFilterVisible && (
          <WhiteButton
            onClick={onReset}
            iconClassName={getIconClassName(iconNames.reset)}
            variant="danger"
          >
            {'Reset'}
          </WhiteButton>
        )}
        {isSaveFilterVisible && (
          <FormControlInput
            name={'name'}
            placeholder="Save View as"
            marginBottom={false}
            value={saveFilterValues.name}
            onChange={handleChange}
            formControlContainerClass={classes.formControlContainer}
            autoFocus
          />
        )}
        {onSaveFilter ? (
          <SplitButton
            items={submitItems}
            onChange={handleChangeItem}
            onClick={handleClick}
          />
        ) : (
          <BlueButton
            onClick={onSubmit}
            iconClassName={getIconClassName(iconNames.search)}
          >
            Search
          </BlueButton>
        )}
      </div>
    </div>
  )
}

export default FilterPanel
