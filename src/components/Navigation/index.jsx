import { useMemo } from 'react'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'

import NavigationLink from './NavigationLink'
import { routes } from 'constants/routes'
import {
  permissionGroupNames,
  permissionTypes
} from 'constants/permissionGroups'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'

const styles = () => ({
  navigation: {
    display: 'flex',
    alignItems: 'stretch'
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5
  }
})

const hasRenderItem = menuItems =>
  menuItems.some(item => !item.hasOwnProperty('render') || item.render)

const countRenderCols = menuItems =>
  menuItems.filter(item => !item.hasOwnProperty('render') || item.render)
    .length > 1
    ? 2
    : 1

const Navigation = ({ t, classes, disabled, theme }) => {
  const readGroups = useUserPermissionGroupsByType(permissionTypes.read)
  const createGroups = useUserPermissionGroupsByType(permissionTypes.create)

  const activityMenuItems = useMemo(
    () => [
      {
        linkTo: routes.activity.toAdd(),
        label: 'Add New Task',
        description: 'Create a new upcoming task and reminder',
        iconClassName: getIconClassName(iconNames.activityAdd),
        render: createGroups.includes(permissionGroupNames.activity)
      },
      {
        linkTo: routes.activity.overDue,
        label: 'Over Due Activities',
        description: 'View a list of overdue tasks and activities',
        iconClassName: getIconClassName(iconNames.activityOverDue),
        render: readGroups.includes(permissionGroupNames.activity)
      },
      {
        linkTo: routes.activity.today,
        label: "Today's Activities",
        description: "View a list of today's tasks and activities",
        iconClassName: getIconClassName(iconNames.activityToday),
        render: readGroups.includes(permissionGroupNames.activity)
      },
      {
        linkTo: routes.activity.pending,
        label: 'Pending Activities',
        description: 'View a list of all pending tasks and activities',
        iconClassName: getIconClassName(iconNames.activityPending),
        render: readGroups.includes(permissionGroupNames.activity)
      }
    ],
    [createGroups, readGroups]
  )

  const clientsMenuItems = useMemo(
    () => [
      {
        linkTo: routes.leads.list,
        label: 'Leads',
        description: 'Create and Nurture Leads & Prospects',
        iconClassName: getIconClassName(iconNames.lead, iconTypes.solid),
        render: readGroups.includes(permissionGroupNames.lead)
      },
      {
        linkTo: routes.accounts.list,
        label: 'Accounts',
        description: 'Create and Manage Clients and Accounts',
        iconClassName: getIconClassName(iconNames.account),
        render: readGroups.includes(permissionGroupNames.account)
      },
      {
        linkTo: routes.contacts.list,
        label: 'Contacts',
        description: 'Create and Manage Client Contacts',
        iconClassName: getIconClassName(iconNames.contact, iconTypes.solid),
        render: readGroups.includes(permissionGroupNames.contact)
      }
    ],
    [readGroups]
  )

  const opportunitiesMenuItems = useMemo(
    () => [
      {
        linkTo: routes.opportunities.list,
        label: 'Opportunity',
        description: 'Create and Manage Upcoming Projects',
        iconClassName: getIconClassName(iconNames.opportunity),
        render: readGroups.includes(permissionGroupNames.opportunity)
      },
      {
        linkTo: routes.estimates.list,
        label: 'Estimate',
        description: 'Create and Manage Estimates for Projects',
        iconClassName: getIconClassName(iconNames.estimate),
        render: readGroups.includes(permissionGroupNames.estimate)
      }
    ],
    [readGroups]
  )

  const ordersMenuItems = useMemo(
    () => [
      {
        linkTo: routes.invoices.list,
        label: 'Invoices',
        description: 'Generate and Send Invoices for Orders',
        iconClassName: getIconClassName(iconNames.invoice),
        render: readGroups.includes(permissionGroupNames.invoice)
      },
      {
        linkTo: routes.subscription.list,
        label: 'Subscription',
        description: 'Create and Manage Recurring Subscriptions',
        iconClassName: getIconClassName(iconNames.subscription),
        render: readGroups.includes(permissionGroupNames.subscription)
      },
      {
        linkTo: routes.payments.list,
        label: 'Payments',
        description: 'View and Manage Invoice Payments & Profiles',
        iconClassName: getIconClassName(iconNames.payment),
        render: readGroups.includes(permissionGroupNames.payment)
      },
      {
        linkTo: routes.order.list,
        label: 'Ready for Approvals',
        description: 'View and Approve Invoices for Orders',
        iconClassName: getIconClassName(iconNames.invoiceApprove),
        render: readGroups.includes(permissionGroupNames.invoice)
      }
    ],
    [readGroups]
  )

  const logisticsMenuItems = useMemo(
    () => [
      {
        linkTo: routes.production.list,
        label: 'Production',
        description: 'Configure and prepare orders for shipment',
        iconClassName: getIconClassName(iconNames.production),
        render: true
      },
      {
        linkTo: routes.shipping.list,
        label: 'Shipping',
        description: 'Create and Manage Order Shipments',
        iconClassName: getIconClassName(iconNames.shipping),
        render: readGroups.includes(permissionGroupNames.shipping)
      },
      {
        linkTo: routes.returns.list,
        label: 'Returns',
        description: 'Create and Manage Reverse Logistics',
        iconClassName: getIconClassName(iconNames.returns),
        render: true
      },
      {
        linkTo: routes.returns.list,
        label: 'Tech Refresh',
        description: 'Create and Manage Tech Refresh',
        iconClassName: getIconClassName(iconNames.techRefresh),
        render: true
      }
    ],
    [readGroups]
  )

  const reportsMenuItems = useMemo(
    () => [
      {
        linkTo: routes.preSales.list,
        label: 'Pre Sale Reports',
        description: 'Leads, MQLs, SQLs related Reports',
        iconClassName: getIconClassName(iconNames.preSales),
        render: true
      },
      {
        linkTo: routes.postSale.list,
        label: 'Post Sale Reports',
        description: 'Orders and Subscription related Reports',
        iconClassName: getIconClassName(iconNames.postSales),
        render: true
      },
      {
        linkTo: routes.otherReport.list,
        label: 'Other Reports',
        description: 'Production & Shipment related Reports',
        iconClassName: getIconClassName(iconNames.otherReport),
        render: true
      }
    ],
    []
  )

  const ticketMenuItems = useMemo(
    () => [
      {
        linkTo: routes.tickets.toAdd(),
        label: 'Create New Ticket',
        description: 'Create new support tickets for Clients',
        iconClassName: getIconClassName(iconNames.addTicketNav),
        render: createGroups.includes(permissionGroupNames.ticket)
      },
      {
        linkTo: routes.tickets.open,
        label: 'All Tickets',
        description: 'Manage all Open Tickets',
        iconClassName: getIconClassName(iconNames.openTicketNav),
        render: readGroups.includes(permissionGroupNames.ticket)
      },
      {
        linkTo: routes.tickets.my,
        label: 'My Tickets',
        description: 'Manage my Open ticket Queue.',
        iconClassName: getIconClassName(iconNames.myTicketNav),
        render: readGroups.includes(permissionGroupNames.ticket)
      },
      {
        linkTo: routes.tickets.onHold,
        label: 'On Hold Tickets',
        description: 'Manage Open, On-hold ticket Queue.',
        iconClassName: getIconClassName(iconNames.holdTicketNav),
        render: readGroups.includes(permissionGroupNames.ticket)
      },
      {
        linkTo: routes.tickets.overDue,
        label: 'Overdue Tickets',
        description: 'Urgent tickets, Respond Now!',
        iconClassName: getIconClassName(iconNames.overdueTicketNav),
        render: readGroups.includes(permissionGroupNames.ticket)
      },
      {
        linkTo: routes.tickets.resolved,
        label: 'Resolved Tickets',
        description: 'Manage all Closed Tickets.',
        iconClassName: getIconClassName(iconNames.resolvedTicketNav),
        render: readGroups.includes(permissionGroupNames.ticket)
      },
      {
        linkTo: routes.tickets.trash,
        label: 'Trash Tickets',
        description: 'Deleted and Spam Tickets.',
        iconClassName: getIconClassName(iconNames.trashTicketNav),
        render: readGroups.includes(permissionGroupNames.ticket)
      }
    ],
    [readGroups, createGroups]
  )

  const navigationStructure = useMemo(
    () => [
      {
        url: routes.activity.today,
        color: '#ff5e44',
        linkIconClassName: getIconClassName(iconNames.activity),
        linkText: 'Activities',
        render: hasRenderItem(activityMenuItems),
        cols: countRenderCols(activityMenuItems),
        menuItems: activityMenuItems
      },
      {
        url: routes.leads.list,
        color: theme.colors.other.color2[theme.type],
        linkIconClassName: getIconClassName(iconNames.clientRootNav),
        linkText: 'Clients',
        render: hasRenderItem(clientsMenuItems),
        cols: countRenderCols(clientsMenuItems),
        menuItems: clientsMenuItems
      },
      {
        url: routes.opportunities.list,
        color: theme.colors.other.color3[theme.type],
        linkIconClassName: getIconClassName(iconNames.opportunityRootNav),
        linkText: 'Opportunities',
        render: hasRenderItem(opportunitiesMenuItems),
        cols: countRenderCols(opportunitiesMenuItems),
        menuItems: opportunitiesMenuItems
      },
      {
        url: routes.invoices.list,
        color: '#ba68c8',
        linkIconClassName: getIconClassName(iconNames.orderRootNav),
        linkText: 'Orders',
        render: hasRenderItem(ordersMenuItems),
        cols: countRenderCols(ordersMenuItems),
        menuItems: ordersMenuItems
      },
      {
        url: routes.production.list,
        color: '#64b5f6',
        linkIconClassName: getIconClassName(iconNames.logisticsRootNav),
        linkText: 'Logistics',
        render: hasRenderItem(logisticsMenuItems),
        cols: countRenderCols(logisticsMenuItems),
        menuItems: logisticsMenuItems
      },
      {
        url: routes.tickets.open,
        color: '#4dd0e1',
        linkIconClassName: getIconClassName(iconNames.ticketRootNav),
        linkText: 'Assist',
        render: hasRenderItem(ticketMenuItems),
        cols: countRenderCols(ticketMenuItems),
        menuItems: ticketMenuItems
      },
      {
        url: routes.preSales.list,
        color: '#90a4ae',
        linkIconClassName: getIconClassName(iconNames.reportRootNav),
        linkText: 'Reports',
        render: hasRenderItem(reportsMenuItems),
        cols: countRenderCols(reportsMenuItems),
        menuItems: reportsMenuItems
      }
    ],
    [
      clientsMenuItems,
      opportunitiesMenuItems,
      ordersMenuItems,
      reportsMenuItems,
      theme,
      activityMenuItems,
      logisticsMenuItems,
      ticketMenuItems
    ]
  )

  return (
    <nav
      className={classNames(classes.navigation, {
        [classes.disabled]: disabled
      })}
    >
      {navigationStructure
        .filter(item => (item.hasOwnProperty('render') ? item.render : true))
        .map((item, index) => (
          <NavigationLink key={`${item.linkText}-${index}`} {...item} t={t} />
        ))}
    </nav>
  )
}

export default withStyles(styles, { withTheme: true })(Navigation)
