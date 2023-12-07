import { useEffect, Suspense, useState, lazy } from 'react'
import { MuiThemeProvider, CssBaseline } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import useAutoTheme from 'hooks/useAutoTheme'
import { SnackbarProvider } from 'notistack'
import { isLoggedIn } from 'utils/authUtils'
import { isAuthorizedSelector } from 'selectors/appSelectors'
import { setAuthorized } from 'slices/appSlice'
import { routes } from 'constants/routes'
import PageLayout from 'components/PageLayout'
import {
  AccountPage,
  ContactPage,
  CustomFieldsPage,
  DashboardPage,
  LeadPage,
  LicensePage,
  OpportunityPage,
  SignInPage,
  TagPage,
  UsersPage,
  ProductPage,
  EstimatePage,
  InvoicePage,
  PaymentPage,
  SystemDictionaryPage,
  SalesTaxPage,
  OverDueActivityPage,
  TodayActivityPage,
  PendingActivityPage,
  TermsAndConditionPage,
  EmailPage,
  ReminderPage,
  TemplatePage,
  PreviewPage,
  PublicPage,
  PublicErrorPage,
  TicketPage,
  SettingPage,
  ShippingPage,
  OrderPage,
  PackageProfilePage
} from 'pages/index'
import { PageLoader } from 'components/loaders'
import useWindowTitle from 'hooks/useWindowTitle'

import './styles/index.scss'
import {
  permissionGroupNames,
  permissionTypes,
  systemDictionaryPermissionGroup
} from 'constants/permissionGroups'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import ErrorBoundary from 'components/ErrorBoundary'
import { ADMINISTRATOR } from 'constants/roleConstants'
import useUser from 'hooks/useUser'
import { onlyPublicView } from 'utils/appUtils'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { _get } from 'utils/lodash'
const AuthLayout = lazy(() => import('components/AuthLayout'))

const UnauthorizedRoute = ({
  component: WrappedComponent,
  render,
  ...props
}) => {
  const isAuthorized = useSelector(isAuthorizedSelector)

  return !isAuthorized ? (
    render || <WrappedComponent {...props} />
  ) : (
    <Navigate to={parseToAbsolutePath(routes.dashboard.root)} replace />
  )
}

function App() {
  const dispatch = useDispatch()
  const [appInitialized, setAppInitialized] = useState(false)
  const isAuthorized = useSelector(isAuthorizedSelector)
  const readGroups = useUserPermissionGroupsByType(permissionTypes.read)
  const { role } = useUser()

  const theme = useAutoTheme()
  useWindowTitle()

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(setAuthorized(true))
      setAppInitialized(true)
    } else {
      setAppInitialized(true)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    document.body.style.background = _get(
      theme,
      `palette.${theme?.type}.body.background`,
      'rgba(255, 255, 255, 0.5)'
    )
  }, [theme])

  return (
    <MuiThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <SnackbarProvider
          classes={{
            root: 'Snackbar',
            variantWarning: 'snackbarWarning',
            ...(isAuthorized && { containerRoot: 'snackbarContainer' })
          }}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top'
          }}
          maxSnack={5}
          disableWindowBlurListener
        >
          <CssBaseline />
          {appInitialized && (
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route
                    path={`${routes.public.root}/*`}
                    element={<PublicPage />}
                  />
                  {onlyPublicView() && (
                    <Route path="*" element={<PublicErrorPage />} />
                  )}
                  {!onlyPublicView() && (
                    <>
                      <Route
                        path={routes.signIn.root}
                        element={<UnauthorizedRoute component={SignInPage} />}
                      />
                      <Route path="*" element={<AuthLayout />}>
                        <Route
                          path={`${routes.preview.root}/*`}
                          element={<PreviewPage />}
                        />
                        <Route element={<PageLayout />}>
                          <Route
                            path={routes.dashboard.root}
                            element={<DashboardPage />}
                          />
                          <Route
                            path={`${routes.users.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.user
                              ) && <UsersPage />
                            }
                          />
                          <Route
                            path={`${routes.tags.root}/*`}
                            element={
                              readGroups.includes(permissionGroupNames.tag) && (
                                <TagPage />
                              )
                            }
                          />
                          <Route
                            path={`${routes.licenses.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.license
                              ) && <LicensePage />
                            }
                          />
                          <Route
                            path={`${routes.activity.overDue}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.activity
                              ) && <OverDueActivityPage />
                            }
                          />
                          <Route
                            path={`${routes.activity.today}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.activity
                              ) && <TodayActivityPage />
                            }
                          />
                          <Route
                            path={`${routes.activity.pending}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.activity
                              ) && <PendingActivityPage />
                            }
                          />
                          <Route
                            path={`${routes.customFields.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.customFields
                              ) && <CustomFieldsPage />
                            }
                          />
                          <Route
                            path={`${routes.leads.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.lead
                              ) && <LeadPage />
                            }
                          />
                          <Route
                            path={`${routes.accounts.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.account
                              ) && <AccountPage />
                            }
                          />
                          <Route
                            path={`${routes.contacts.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.contact
                              ) && <ContactPage />
                            }
                          />
                          <Route
                            path={`${routes.tickets.open}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.ticket
                              ) && <TicketPage />
                            }
                          />
                          <Route
                            path={`${routes.opportunities.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.opportunity
                              ) && <OpportunityPage />
                            }
                          />
                          <Route
                            path={`${routes.products.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.product
                              ) && <ProductPage />
                            }
                          />
                          <Route
                            path={`${routes.estimates.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.estimate
                              ) && <EstimatePage />
                            }
                          />
                          <Route
                            path={`${routes.invoices.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.invoice
                              ) && <InvoicePage />
                            }
                          />
                          <Route
                            path={`${routes.payments.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.payment
                              ) && <PaymentPage />
                            }
                          />
                          <Route
                            path={`${routes.systemDictionary.root}/*`}
                            element={
                              systemDictionaryPermissionGroup.some(p =>
                                readGroups.includes(p)
                              ) &&
                              role?.name === ADMINISTRATOR && (
                                <SystemDictionaryPage />
                              )
                            }
                          />
                          <Route
                            path={`${routes.salesTax.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.salesTax
                              ) && <SalesTaxPage />
                            }
                          />
                          <Route
                            path={`${routes.termsAndConditions.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.termsAndConditions
                              ) && <TermsAndConditionPage />
                            }
                          />
                          <Route
                            path={`${routes.email.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.email
                              ) && <EmailPage />
                            }
                          />
                          <Route
                            path={`${routes.reminder.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.reminder
                              ) && <ReminderPage />
                            }
                          />
                          <Route
                            path={`${routes.template.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.template
                              ) && <TemplatePage />
                            }
                          />
                          <Route
                            path={`${routes.shipping.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.invoice
                              ) && <ShippingPage />
                            }
                          />
                          <Route
                            path={`${routes.order.root}/*`}
                            element={
                              readGroups.includes(
                                permissionGroupNames.invoice
                              ) && <OrderPage />
                            }
                          />
                          <Route
                            path={`${routes.settings.root}/*`}
                            element={
                              role?.name === ADMINISTRATOR && <SettingPage />
                            }
                          />
                          <Route
                            path={`${routes.packageProfile.root}/*`}
                            element={
                              role?.name === ADMINISTRATOR && (
                                <PackageProfilePage />
                              )
                            }
                          />
                          <Route
                            path="*"
                            element={
                              <Navigate
                                to={parseToAbsolutePath(routes.dashboard.root)}
                              />
                            }
                          />
                        </Route>
                      </Route>
                    </>
                  )}
                </Routes>
              </Suspense>
            </ErrorBoundary>
          )}
        </SnackbarProvider>
      </DndProvider>
    </MuiThemeProvider>
  )
}

export default App
