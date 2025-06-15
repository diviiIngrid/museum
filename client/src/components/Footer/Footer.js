import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <h3>Национальный музей</h3>
          <p>Познакомься с историей Республики Тыва</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h4>Информация</h4>
            <ul>
              <li><Link to="/visit">Информация</Link></li>
              <li><Link to="/exhibitions">Выставки</Link></li>
              <li><Link to="/visit">Часы работы</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>О нас</h4>
            <ul>
              <li><Link to="/about">О нас</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Аккаунт</h4>
            <ul>
              <li><Link to="/register">Регистрация</Link></li>
              <li><Link to="/login">Авторизация</Link></li>
              <li><Link to="/profile">Мой профиль</Link></li>
              <li><Link to="/profile">Мои билеты</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Национальный музей имени Алдан-Маадыр Республики Тыва. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  