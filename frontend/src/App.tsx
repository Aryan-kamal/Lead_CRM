import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LeadsProvider } from './context/LeadsContext';
import { LeadCreatePage } from './pages/LeadCreatePage';
import { LeadDetailPage } from './pages/LeadDetailPage';
import { LeadEditPage } from './pages/LeadEditPage';
import { BoardPage } from './pages/BoardPage';
import { LeadsListPage } from './pages/LeadsListPage';

export default function App() {
  return (
    <BrowserRouter>
      <LeadsProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route element={<AppLayout />}>
            <Route path="board" element={<BoardPage />} />
            <Route path="leads">
              <Route index element={<LeadsListPage />} />
              <Route path="new" element={<LeadCreatePage />} />
              <Route path=":id/edit" element={<LeadEditPage />} />
              <Route path=":id" element={<LeadDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </LeadsProvider>
    </BrowserRouter>
  );
}
