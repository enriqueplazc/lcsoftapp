// src/Router.tsx
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { Home } from './pages';
import { Blog } from './pages/Blog';
import { Contacto } from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import { ProtectedRoute } from './middleware/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import Articles from './pages/admin/Articles';
import ArticleEditor from './pages/admin/ArticleEditor';
import Submissions from './pages/admin/Submissions';
import Clients from './pages/admin/Clients';
import ClientEditor from './pages/admin/ClientEditor';

export const Router = () => {
  const router = createBrowserRouter([
    // ── Sitio público ──────────────────────────────
    { path: '/', element: <Home /> },
    { path: '/blog/:id', element: <Blog /> },
    { path: '/contact', element: <Contacto /> },

    // ── Auth ───────────────────────────────────────
    { path: '/login', element: <AdminLogin /> },

    // ── Panel admin (protegido) ────────────────────
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Navigate to="/admin/articles" replace />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/articles',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Articles />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/articles/new',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <ArticleEditor />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/articles/:id/edit',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <ArticleEditor />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/submissions',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Submissions />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/clients',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Clients />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/clients/new',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <ClientEditor />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/clients/:id/edit',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <ClientEditor />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};