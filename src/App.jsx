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
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicQuiz from "./pages/PublicQuiz";
import QuizResult from "./pages/QuizResult";
import TakeQuiz from "./pages/TakeQuiz";
import ProtectedRoute from "./routes/ProtectedRoute";

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
            <Route path="/take-quiz/:id" element={<TakeQuiz />} />
            <Route path="/quiz/:id" element={<PublicQuiz />} />

            {/* Protected Routes with Main Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quiz-result/:id" element={<QuizResult />} />
            </Route>

            {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
