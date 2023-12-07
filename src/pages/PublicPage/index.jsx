import { Route, Routes } from 'react-router-dom'
import { routes } from 'constants/routes'
import ProposalPage from './ProposalPage'
import InvoicePage from './InvoicePage'

const PublicPage = () => {
  return (
    <Routes>
      <Route path={`${routes.public.proposal}/*`} element={<ProposalPage />} />
      <Route path={`${routes.public.invoice}/*`} element={<InvoicePage />} />
    </Routes>
  )
}

export default PublicPage
