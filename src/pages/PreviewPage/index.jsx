import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { routes } from 'constants/routes'
import ProposalPreview from './ProposalPreview'
import { parseToAbsolutePath } from 'utils/urlUtils'
import InvoicePreview from './InvoicePreview'

const PreviewPage = () => {
  return (
    <Routes>
      <Route path={routes.preview.proposal} element={<ProposalPreview />} />
      <Route path={routes.preview.invoice} element={<InvoicePreview />} />
      <Route
        path="*"
        element={<Navigate to={parseToAbsolutePath(routes.dashboard.root)} />}
      />
    </Routes>
  )
}

export default PreviewPage
