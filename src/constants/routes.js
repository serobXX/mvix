import { _isNotEmpty } from 'utils/lodash'

export const tableViews = {
  list: 'list',
  grid: 'grid'
}

export const commonRoutes = {
  add: ':view/add',
  edit: ':view/edit/:id',
  view: ':view/view/:id'
}

export const entityCommonRoutes = {
  add: ':entity/add',
  edit: ':entity/edit/:id'
}

export const createBaseRoutes = rootRoute => ({
  root: rootRoute,
  add: commonRoutes.add,
  edit: commonRoutes.edit,
  view: commonRoutes.view,
  list: `${rootRoute}/${tableViews.list}`,
  grid: `${rootRoute}/${tableViews.grid}`
})

const createToRoute =
  (...parts) =>
  (id, view = tableViews.list, replaceData) => {
    let str = `/${parts.join('/').replace(':view', view).replace(`:id`, id)}`

    if (_isNotEmpty(replaceData)) {
      Object.entries(replaceData).forEach(([key, value]) => {
        str = str.replace(`:${key}`, value)
      })
    }

    return str
  }

const createToRouteForEnity =
  (...parts) =>
  (id, entity) =>
    createToRoute(...parts)(id, tableViews.list, { entity })

const createToRouteForMultiEnity =
  (...parts) =>
  (id, dictionary, entity) =>
    createToRoute(...parts)(id, tableViews.list, { dictionary, entity })

const createToRoutes = rootRoute => ({
  toView: createToRoute(rootRoute, commonRoutes.view),
  toAdd: createToRoute(rootRoute, commonRoutes.add),
  toEdit: createToRoute(rootRoute, commonRoutes.edit)
})

const rootRoutes = {
  signIn: 'sign-in',
  dashboard: 'dashboard',
  users: 'users',
  products: 'products',
  rolesAndPermissions: 'roles-permissions',
  tags: 'tags',
  leads: 'leads',
  systemDictionary: 'system-dictionary',
  licenses: 'licenses',
  accounts: 'accounts',
  contacts: 'contacts',
  tickets: 'tickets',
  opportunities: 'opportunities',
  estimates: 'estimates',
  invoices: 'invoices',
  subscription: 'subscription',
  payments: 'payments',
  production: 'production',
  shipping: 'shipping',
  order: 'ready-for-approval',
  returns: 'returns',
  preSales: 'pre-sales',
  postSale: 'post-sale',
  otherReport: 'other-report',
  profile: 'profile',
  activity: 'activity',
  overDueActivity: 'overdue-activities',
  pendingActivity: 'pending-activities',
  todayActivity: 'today-activities',
  customFields: 'custom-fields',
  salesTax: 'sales-tax',
  termsAndConditions: 'terms-and-conditions',
  solutionSet: 'solution-sets',
  email: 'emails',
  reminder: 'reminders',
  template: 'templates',
  preview: 'preview',
  public: 'public-page/:token',
  settings: 'settings',
  projects: 'projects',
  department: 'department',
  notifications: 'notifications',
  openTickets: 'open-tickets',
  myTickets: 'my-tickets',
  onHoldTickets: 'hold-tickets',
  overdueTickets: 'overdue-tickets',
  resolvedTickets: 'resolved-tickets',
  trashTickets: 'trash-tickets',
  cannedResponse: 'canned-response',
  automatedResponse: 'automated-response',
  announcements: 'announcements',
  assistSettings: 'assist-settings',
  packageProfile: 'package-profile'
}

export const routes = {
  signIn: {
    root: rootRoutes.signIn
  },
  dashboard: {
    root: rootRoutes.dashboard
  },
  users: {
    ...createBaseRoutes(rootRoutes.users),
    ...createToRoutes(rootRoutes.users),
    roleAndPerm: `:view/${rootRoutes.rolesAndPermissions}`,
    toRoleAndPerm: createToRoute(
      rootRoutes.users,
      `:view/${rootRoutes.rolesAndPermissions}`
    ),
    roleAndPermAdd: `add`,
    toRoleAndPermAdd: createToRoute(
      rootRoutes.users,
      `:view/${rootRoutes.rolesAndPermissions}`,
      'add'
    ),
    roleAndPermEdit: `edit/:id`,
    toRoleAndPermEdit: createToRoute(
      rootRoutes.users,
      `:view/${rootRoutes.rolesAndPermissions}`,
      `edit/:id`
    )
  },
  products: {
    ...createBaseRoutes(rootRoutes.products),
    ...createToRoutes(rootRoutes.products),
    solutionSet: `${tableViews.list}/${rootRoutes.solutionSet}`
  },
  tags: {
    ...createBaseRoutes(rootRoutes.tags),
    ...createToRoutes(rootRoutes.tags)
  },
  leads: {
    ...createBaseRoutes(rootRoutes.leads),
    ...createToRoutes(rootRoutes.leads)
  },
  accounts: {
    ...createBaseRoutes(rootRoutes.accounts),
    ...createToRoutes(rootRoutes.accounts)
  },
  contacts: {
    ...createBaseRoutes(rootRoutes.contacts),
    ...createToRoutes(rootRoutes.contacts)
  },
  opportunities: {
    ...createBaseRoutes(rootRoutes.opportunities),
    ...createToRoutes(rootRoutes.opportunities),
    libraryAdd: `:view/${rootRoutes.opportunities}/add`,
    toLibraryAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.opportunities, 'add')()
  },
  estimates: {
    ...createBaseRoutes(rootRoutes.estimates),
    ...createToRoutes(rootRoutes.estimates),
    libraryAdd: `:view/${rootRoutes.estimates}/add`,
    toLibraryAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.estimates, 'add')(),
    detailAdd: `${rootRoutes.estimates}/add`,
    toDetailAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.estimates, 'add')(),
    detailEdit: `${rootRoutes.estimates}/edit/:estimateId`,
    toDetailEdit: (rootRoute, estimateId) =>
      createToRoute(rootRoute, rootRoutes.estimates, `edit/${estimateId}`)(),
    detailClone: `${rootRoutes.estimates}/clone/:estimateId`,
    toDetailClone: (rootRoute, estimateId) =>
      createToRoute(rootRoute, rootRoutes.estimates, `clone/${estimateId}`)()
  },
  invoices: {
    ...createBaseRoutes(rootRoutes.invoices),
    ...createToRoutes(rootRoutes.invoices),
    libraryAdd: `:view/${rootRoutes.invoices}/add`,
    toLibraryAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.invoices, 'add')()
  },
  subscription: {
    ...createBaseRoutes(rootRoutes.subscription),
    ...createToRoutes(rootRoutes.subscription)
  },
  payments: {
    ...createBaseRoutes(rootRoutes.payments),
    ...createToRoutes(rootRoutes.payments),
    detailAdd: `${rootRoutes.payments}/add`,
    toDetailAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.payments, 'add')()
  },
  production: {
    ...createBaseRoutes(rootRoutes.production),
    ...createToRoutes(rootRoutes.production)
  },
  shipping: {
    ...createBaseRoutes(rootRoutes.shipping),
    ...createToRoutes(rootRoutes.shipping)
  },
  returns: {
    ...createBaseRoutes(rootRoutes.returns),
    ...createToRoutes(rootRoutes.returns)
  },
  preSales: {
    ...createBaseRoutes(rootRoutes.preSales),
    ...createToRoutes(rootRoutes.preSales)
  },
  postSale: {
    ...createBaseRoutes(rootRoutes.postSale),
    ...createToRoutes(rootRoutes.postSale)
  },
  otherReport: {
    ...createBaseRoutes(rootRoutes.otherReport),
    ...createToRoutes(rootRoutes.otherReport)
  },
  licenses: {
    ...createBaseRoutes(rootRoutes.licenses),
    ...createToRoutes(rootRoutes.licenses)
  },
  activity: {
    overDue: rootRoutes.overDueActivity,
    today: rootRoutes.todayActivity,
    pending: rootRoutes.pendingActivity,
    add: 'add',
    edit: 'edit/:id',
    toAdd: createToRoute(rootRoutes.pendingActivity, 'add'),
    toEdit: (rootRoute, id) => createToRoute(rootRoute, 'edit/:id')(id),

    libraryAdd: `:view/${rootRoutes.activity}/add`,
    toLibraryAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.activity, 'add')(),
    detailAdd: `${rootRoutes.activity}/add`,
    toDetailAdd: rootRoute =>
      createToRoute(rootRoute, rootRoutes.activity, 'add')(),
    detailEdit: `${rootRoutes.activity}/edit/:activityId`,
    toDetailEdit: (rootRoute, activityId) =>
      createToRoute(rootRoute, rootRoutes.activity, `edit/${activityId}`)()
  },
  customFields: {
    root: rootRoutes.customFields,
    edit: ':entity/edit',
    toEdit: createToRouteForEnity(rootRoutes.customFields, ':entity/edit')
  },
  systemDictionary: {
    root: rootRoutes.systemDictionary,
    dictionary: `:dictionary`,
    entity: `:dictionary/:entity`,
    add: `:dictionary/:entity/add`,
    edit: `:dictionary/:entity/edit/:id`,

    toDictionary: createToRouteForMultiEnity(
      rootRoutes.systemDictionary,
      `:dictionary`
    ),
    toEntity: createToRouteForMultiEnity(
      rootRoutes.systemDictionary,
      ':dictionary',
      `:entity`
    ),
    toAdd: createToRouteForMultiEnity(
      rootRoutes.systemDictionary,
      ':dictionary',
      entityCommonRoutes.add
    ),
    toEdit: createToRouteForMultiEnity(
      rootRoutes.systemDictionary,
      ':dictionary',
      entityCommonRoutes.edit
    )
  },
  salesTax: {
    ...createBaseRoutes(rootRoutes.salesTax),
    ...createToRoutes(rootRoutes.salesTax)
  },
  termsAndConditions: {
    root: rootRoutes.termsAndConditions
  },
  email: {
    root: rootRoutes.email
  },
  reminder: {
    ...createBaseRoutes(rootRoutes.reminder),
    ...createToRoutes(rootRoutes.reminder)
  },
  template: {
    root: rootRoutes.template,
    add: 'add',
    toAdd: createToRoute(rootRoutes.template, 'add'),
    edit: 'edit/:id',
    toEdit: createToRoute(rootRoutes.template, 'edit/:id')
  },
  preview: {
    root: rootRoutes.preview,
    proposal: `opportunity/:id/proposal`,
    toProposal: createToRoute(rootRoutes.preview, 'opportunity/:id/proposal'),
    invoice: `invoice/:id`,
    toInvoice: createToRoute(rootRoutes.preview, 'invoice/:id')
  },
  public: {
    root: rootRoutes.public,
    proposal: `proposal`,
    toProposal: token =>
      createToRoute(rootRoutes.public, 'proposal')(null, null, { token }),
    invoice: `invoice`,
    toInvoice: token =>
      createToRoute(rootRoutes.public, 'invoice')(null, null, { token })
  },
  settings: {
    root: rootRoutes.settings
  },
  order: {
    ...createBaseRoutes(rootRoutes.order),
    ...createToRoutes(rootRoutes.order)
  },
  packageProfile: {
    ...createBaseRoutes(rootRoutes.packageProfile),
    ...createToRoutes(rootRoutes.packageProfile)
  },
  // Assist Routes
  projects: {
    ...createBaseRoutes(rootRoutes.projects),
    ...createToRoutes(rootRoutes.projects)
  },
  department: {
    ...createBaseRoutes(rootRoutes.department),
    ...createToRoutes(rootRoutes.department)
  },
  notifications: {
    root: rootRoutes.notifications
  },
  tickets: {
    open: rootRoutes.openTickets,
    my: rootRoutes.myTickets,
    overDue: rootRoutes.overdueTickets,
    onHold: rootRoutes.onHoldTickets,
    trash: rootRoutes.trashTickets,
    resolved: rootRoutes.resolvedTickets,
    add: 'add',
    edit: 'edit/:id',
    toAdd: createToRoute(rootRoutes.openTickets, 'add'),
    toEdit: (rootRoute, id) => createToRoute(rootRoute, 'edit/:id')(id)
  },
  cannedResponse: {
    ...createBaseRoutes(rootRoutes.cannedResponse),
    ...createToRoutes(rootRoutes.cannedResponse)
  },
  automatedResponse: {
    ...createBaseRoutes(rootRoutes.automatedResponse),
    ...createToRoutes(rootRoutes.automatedResponse)
  },
  announcements: {
    ...createBaseRoutes(rootRoutes.announcements),
    ...createToRoutes(rootRoutes.announcements)
  },
  assistSettings: {
    root: rootRoutes.assistSettings
  }
}
