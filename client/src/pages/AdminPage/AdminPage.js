import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaCalendarAlt} from 'react-icons/fa';
import ExhibitionManagement from './components/ExhibitionManagement';
import ReservationManagement from './components/ReservationManagement';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('exhibitions');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === 'exhibitions' ? '' : tab}`);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Панель админа</h1>
        </div>
      </div>

      <div className="admin-content section">
        <div className="container">
          <div className="admin-navigation">
            <button 
              className={`admin-tab ${activeTab === 'exhibitions' ? 'active' : ''}`}
              onClick={() => handleTabChange('exhibitions')}
            >
              <FaCalendarAlt />
              <span>Выставки</span>
            </button>
            <button 
              className={`admin-tab ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => handleTabChange('reservations')}
            >
              <FaClipboardList />
              <span>Бронирования</span>
            </button>
          </div>

          <div className="admin-panel">
            <Routes>
              <Route path="/" element={<ExhibitionManagement />} />
              <Route path="reservations" element={<ReservationManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
  