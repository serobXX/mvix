import { useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import DictionaryLayout from 'components/DictionaryLayout'
import PageContainer from 'components/PageContainer'
import {
  contactDictionaryPermissionGroup,
  leadDictionaryPermissionGroup,
  permissionGroupNames,
  permissionTypes
} from 'constants/permissionGroups'
import { routes } from 'constants/routes'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import Dictionary from './Dictionary'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { BlueButton } from 'components/buttons'
import SystemDictionaryContext from './context'
import AddEditItem from './AddEditItem'
import {
  subtabPermissions,
  subtabTitles,
  tabMapping,
  tabNames
} from 'constants/systemDictionary'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const SystemDictionaryPage = () => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState()
  const [activeSubtab, setActiveSubtab] = useState()
  const [showCommonActions, setShowCommonActions] = useState(false)
  const [commonActions, setCommonActions] = useState([])
  const [sidePanels, setSidePanels] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const readGroups = useUserPermissionGroupsByType(permissionTypes.read)
  const createGroups = useUserPermissionGroupsByType(permissionTypes.create)
  const updateGroups = useUserPermissionGroupsByType(permissionTypes.update)

  const tabs = useMemo(
    () => [
      {
        value: tabNames.lead,
        render: leadDictionaryPermissionGroup.some(p => readGroups.includes(p)),
        to: routes.systemDictionary.toDictionary(null, tabNames.lead)
      },
      {
        value: tabNames.account,
        render: readGroups.includes(permissionGroupNames.accountPartnership),
        to: routes.systemDictionary.toDictionary(null, tabNames.account)
      },
      {
        value: tabNames.contact,
        render: contactDictionaryPermissionGroup.some(p =>
          readGroups.includes(p)
        ),
        to: routes.systemDictionary.toDictionary(null, tabNames.contact)
      },
      {
        value: tabNames.opportunity,
        render: readGroups.includes(permissionGroupNames.stage),
        to: routes.systemDictionary.toDictionary(null, tabNames.opportunity)
      },
      {
        value: tabNames.activity,
        render: readGroups.includes(permissionGroupNames.subjectLine),
        to: routes.systemDictionary.toDictionary(null, tabNames.activity)
      }
    ],
    [readGroups]
  )

  const parseTabs = useMemo(
    () =>
      tabs
        .filter(({ render }) => render)
        .map(t => ({
          ...t,
          label: tabMapping[t.value].title
        })),
    [tabs]
  )

  useEffect(() => {
    if (
      parseTabs.length &&
      (location.pathname ===
        parseToAbsolutePath(routes.systemDictionary.root) ||
        location.pathname ===
          `${parseToAbsolutePath(routes.systemDictionary.root)}/`)
    ) {
      navigate(
        routes.systemDictionary.toDictionary(null, parseTabs[0]?.value),
        {
          replace: true
        }
      )
    }
    //eslint-disable-next-line
  }, [parseTabs])

  const contextValue = useMemo(
    () => ({
      tabs: parseTabs,
      activeTab,
      onChangeTab: setActiveTab,
      activeSubtab,
      onChangeSubtab: setActiveSubtab,
      showCommonActions,
      setShowCommonActions,
      commonActions,
      setCommonActions,
      sidePanels,
      setSidePanels
    }),
    [
      parseTabs,
      activeTab,
      showCommonActions,
      commonActions,
      sidePanels,
      activeSubtab
    ]
  )

  return (
    <PageContainer
      pageTitle={
        activeTab
          ? `${tabMapping[activeTab].title} Dictionary${
              subtabTitles[activeSubtab]
                ? ` | ${subtabTitles[activeSubtab].rootPage}`
                : ''
            }`
          : ''
      }
      isShowSubHeaderComponent={false}
      pageContainerClassName={classes.root}
      ActionButtonsComponent={
        <>
          {createGroups.includes(subtabPermissions[activeSubtab]) && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.systemDictionary.toAdd(null, activeTab, activeSubtab)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              {subtabTitles[activeSubtab]?.addPage}
            </BlueButton>
          )}
        </>
      }
      showSidebar
      sidePanels={sidePanels}
      showActions={showCommonActions}
      actions={commonActions}
    >
      <DictionaryLayout
        tabs={parseTabs}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      >
        <SystemDictionaryContext.Provider value={contextValue}>
          <Routes>
            <Route
              path={`${routes.systemDictionary.entity}/*`}
              element={<Dictionary readGroups={readGroups} />}
            />
            <Route
              path={`${routes.systemDictionary.dictionary}/*`}
              element={<Dictionary readGroups={readGroups} />}
            />
          </Routes>
        </SystemDictionaryContext.Provider>
      </DictionaryLayout>
      <Routes>
        {createGroups.includes(subtabPermissions[activeSubtab]) && (
          <Route
            path={routes.systemDictionary.add}
            element={
              <AddEditItem activeTab={activeTab} activeSubtab={activeSubtab} />
            }
          />
        )}
        {updateGroups.includes(subtabPermissions[activeSubtab]) && (
          <Route
            path={routes.systemDictionary.edit}
            element={
              <AddEditItem activeTab={activeTab} activeSubtab={activeSubtab} />
            }
          />
        )}
      </Routes>
    </PageContainer>
  )
}

export default SystemDictionaryPage
