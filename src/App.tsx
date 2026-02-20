import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import ProtectedRoute from './lib/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RouteEditor from './pages/RouteEditor';
import RouteDetail from './pages/RouteDetail';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Info from './pages/Info';
import AllRoutes from './pages/AllRoutes';
import SavedRoutes from './pages/SavedRoutes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Dashboard />} />
          <Route path="routes" element={<AllRoutes />} />
          <Route path="saved" element={<SavedRoutes />} />
          <Route path="route/:id" element={<RouteDetail />} />
          <Route path="info" element={<Info />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="editor" element={<RouteEditor />} />
            <Route path="editor/:id" element={<RouteEditor />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
