import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, isAuth, setUser, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logOut = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <h1>Национальный музей имени Алдын-Маадыр Республики Тыва</h1>
        </Link>

        <nav className="main-nav">
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/exhibitions">Выставки</Link></li>
            <li><Link to="/visit">Информация</Link></li>
          </ul>
        </nav>

        <div className="auth-nav">
          {isAuth ? (
            <>
              <Link to="/profile" className="profile-link">
                <FaUser />
                <span>Профиль</span>
              </Link>
              {user && user.role === 'ADMIN' && (
                <Link to="/admin" className="admin-link">
                  Admin
                </Link>
              )}
              <button onClick={logOut} className="logout-btn">
                <FaSignOutAlt />
                <span>Выйти</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Войти</Link>
              <Link to="/register" className="btn btn-primary">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
  