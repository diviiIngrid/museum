import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">Вернуться домой</Link>
            <Link to="/exhibitions" className="btn btn-outline">Больше выставок</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
  