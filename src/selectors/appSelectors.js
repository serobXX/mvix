export const isConfirmationRequiredSelector = ({ app }) =>
  app.isConfirmationRequired

export const themeSelector = ({ app }) => app.theme

export const isAuthorizedSelector = ({ app }) => app.isAuthorized

export const tooltipStateSelector = ({ app }) => app.openedTooltips

export const storedOptionsSelector = ({ app }) => app.storedOptions

export const profileOpenedSelector = ({ app }) => app.profileOpened
