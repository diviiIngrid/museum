import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ExhibitionsPage from './pages/ExhibitionsPage/ExhibitionsPage';
import ExhibitionDetailPage from './pages/ExhibitionDetailPage/ExhibitionDetailPage';
import VisitPage from './pages/VisitPage/VisitPage';
import LoginPage from './pages/LoginPage/LoginPage';
import AboutPage from './pages/AboutPage/AboutPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage/AdminPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { check } from './http/userAPI';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { user, setUser, setIsAuth } = useContext(AuthContext);

  useEffect(() => {
    check().then(data => {
      setUser(data);
      setIsAuth(true);
    }).catch(e => {
      console.log('Not authenticated');
    });
  }, [setUser, setIsAuth]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/profile" 
            element={
              user ? <ProfilePage /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              user && user.role === 'ADMIN' ? <AdminPage /> : <Navigate to="/" />
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
  