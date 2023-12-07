import './init'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles'
import { LicenseManager } from 'ag-grid-enterprise'

import App from './App'
import { store } from './store/store'
import { config } from 'constants/app'

const generateClassName = createGenerateClassName({
  seed: 'mvix'
})

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_LICENSE)

ReactDOM.render(
  <Provider store={store}>
    <StylesProvider generateClassName={generateClassName}>
      <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </StylesProvider>
  </Provider>,
  document.getElementById('root')
)
