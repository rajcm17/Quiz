import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Analytics from "./pages/Analytics";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicQuiz from "./pages/PublicQuiz";
import QuizResult from "./pages/QuizResult";
import TakeQuiz from "./pages/TakeQuiz";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/take-quiz/:id" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<PublicQuiz />} />

            {/* Protected Routes with Main Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Both User and Admin can access dashboard, profile, and take quizzes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz-result/:id" element={<QuizResult />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin-only routes */}
              <Route 
                path="/create-quiz" 
                element={
                  <RoleBasedRoute allowedRoles="admin">
                    <CreateQuiz />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/edit-quiz/:id" 
                element={
                  <RoleBasedRoute allowedRoles="admin">
                    <EditQuiz />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <RoleBasedRoute allowedRoles="admin">
                    <Analytics />
                  </RoleBasedRoute>
                } 
              />
            </Route>

            {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
