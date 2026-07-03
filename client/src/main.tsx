import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
import './index.css'
import { AuthProvider } from './lib/auth-context'
import { ChatRealtimeProvider } from './lib/chat-realtime-context'
import { SearchProvider } from './lib/search-context'
import { ThemeProvider } from './lib/theme-context'
import { MessagingHub } from './components/messaging-hub'
import { CreateProjectPage } from './pages/CreateProjectPage'
import { HomePage } from './pages/HomePage'
import { ManageProjectsPage } from './pages/ManageProjectsPage'
import { PopularPage } from './pages/PopularPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProjectPage } from './pages/ProjectPage'
import { InstructorClassesPage } from './pages/dashboard/instructor/InstructorClassesPage'
import { InstructorClassStudentsPage } from './pages/dashboard/instructor/InstructorClassStudentsPage'
import { InstructorClassProjectsPage } from './pages/dashboard/instructor/InstructorClassProjectsPage'
import { StudentClassesPage } from './pages/dashboard/student/StudentClassesPage'
import { StudentClassProjectsPage } from './pages/dashboard/student/StudentClassProjectsPage'
import { StudentClassMyProjectsPage } from './pages/dashboard/student/StudentClassMyProjectsPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { ShowcasePage } from './pages/ShowcasePage'
import { useAuth } from './lib/auth-context'

function RootLayout() {
  return (
    <>
      <Outlet />
      <MessagingHub />
    </>
  )
}

function RoleAwareHomePage() {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated && user?.role === "instructor") {
    return <Navigate to="/dashboard/instructor/classes" replace />
  }
  if (isAuthenticated && user?.role === "student") {
    return <Navigate to="/dashboard/student/classes" replace />
  }
  return <HomePage />
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <RoleAwareHomePage /> },
      { path: '/popular', element: <PopularPage /> },
      { path: '/showcase', element: <ShowcasePage /> },
      { path: '/create-project', element: <CreateProjectPage /> },
      { path: '/manage-projects', element: <ManageProjectsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/users/:userId', element: <UserProfilePage /> },
      { path: '/project/:id', element: <ProjectPage /> },
      { path: '/dashboard/instructor/classes', element: <InstructorClassesPage /> },
      { path: '/dashboard/instructor/classes/:id/students', element: <InstructorClassStudentsPage /> },
      { path: '/dashboard/instructor/classes/:id/projects', element: <InstructorClassProjectsPage /> },
      { path: '/dashboard/student/classes', element: <StudentClassesPage /> },
      { path: '/dashboard/student/classes/:id/projects', element: <StudentClassProjectsPage /> },
      { path: '/dashboard/student/classes/:id/my-projects', element: <StudentClassMyProjectsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ChatRealtimeProvider>
          <SearchProvider>
            <RouterProvider router={router} />
          </SearchProvider>
        </ChatRealtimeProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
