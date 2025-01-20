import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './compnents/Layout';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './Virtual/PrivateRoute';
import TeacherDetails from './pages/TeacherDetails';
import StudentDetails from './pages/StudentDetails';
import ClassDetails from './pages/ClassDetails';
import SubjectDetails from './pages/SubjectDetails';
import AddTeacher from './pages/AddTeacher';
import AddSubject from './pages/AddSubject';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <PrivateRoute>
              <Layout>
                <SubjectDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-teacher"
          element={
            <PrivateRoute>
              <Layout>
                <AddTeacher />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-subjects"
          element={
            <PrivateRoute>
              <Layout>
                <AddSubject />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <PrivateRoute>
              <Layout>
                <TeacherDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Layout>
                <StudentDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <PrivateRoute>
              <Layout>
                <ClassDetails />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
