import { lazy } from 'react'

const SignInPage = lazy(() => import('pages/SignInPage'))
const UsersPage = lazy(() => import('pages/UsersPage'))
const TagPage = lazy(() => import('pages/TagPage'))
const LicensePage = lazy(() => import('pages/LicensePage'))
const OverDueActivityPage = lazy(() =>
  import('pages/ActivityPage/OverDueActivityPage')
)
const TodayActivityPage = lazy(() =>
  import('pages/ActivityPage/TodayActivityPage')
)
const PendingActivityPage = lazy(() =>
  import('pages/ActivityPage/PendingActivityPage')
)
const CustomFieldsPage = lazy(() => import('pages/CustomFieldsPage'))
const LeadPage = lazy(() => import('pages/LeadPage'))
const AccountPage = lazy(() => import('pages/AccountPage'))
const ContactPage = lazy(() => import('pages/ContactPage'))
const TicketPage = lazy(() => import('pages/TicketPage'))
const OpportunityPage = lazy(() => import('pages/OpportunityPage'))
const ProductPage = lazy(() => import('pages/ProductPage'))
const EstimatePage = lazy(() => import('pages/EstimatePage'))
const InvoicePage = lazy(() => import('pages/InvoicePage'))
const PaymentPage = lazy(() => import('pages/PaymentPage'))
const SystemDictionaryPage = lazy(() => import('pages/SystemDictionaryPage'))
const SalesTaxPage = lazy(() => import('pages/SalesTaxPage'))
const TermsAndConditionPage = lazy(() => import('pages/TermsAndConditionPage'))
const ProfilePage = lazy(() => import('pages/ProfilePage'))
const EmailPage = lazy(() => import('pages/EmailPage'))
const ReminderPage = lazy(() => import('pages/ReminderPage'))
const TemplatePage = lazy(() => import('pages/TemplatePage'))
const PreviewPage = lazy(() => import('pages/PreviewPage'))
const PublicPage = lazy(() => import('pages/PublicPage'))
const PublicErrorPage = lazy(() => import('pages/PublicPage/ErrorPage'))
const DashboardPage = lazy(() => import('pages/DashboardPage'))
const SettingPage = lazy(() => import('pages/SettingPage'))
const ShippingPage = lazy(() => import('pages/ShippingPage'))
const OrderPage = lazy(() => import('pages/OrderPage'))
const PackageProfilePage = lazy(() => import('pages/PackageProfilePage'))

export {
  SignInPage,
  DashboardPage,
  UsersPage,
  TagPage,
  LicensePage,
  OverDueActivityPage,
  TodayActivityPage,
  PendingActivityPage,
  CustomFieldsPage,
  LeadPage,
  AccountPage,
  ContactPage,
  TicketPage,
  OpportunityPage,
  ProductPage,
  EstimatePage,
  InvoicePage,
  PaymentPage,
  SystemDictionaryPage,
  SalesTaxPage,
  TermsAndConditionPage,
  ProfilePage,
  EmailPage,
  ReminderPage,
  TemplatePage,
  PreviewPage,
  PublicPage,
  PublicErrorPage,
  SettingPage,
  ShippingPage,
  OrderPage,
  PackageProfilePage
}
