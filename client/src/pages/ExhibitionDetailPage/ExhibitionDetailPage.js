import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOneExhibition } from '../../http/exhibitionAPI';
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { FaCalendarAlt, FaTicketAlt, FaClock } from 'react-icons/fa';
import './ExhibitionDetailPage.css';

const ExhibitionDetailPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExhibitionDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchOneExhibition(id);
        setExhibition(data);
      } catch (error) {
        console.error('Ошибка при получении сведений о выставке:', error);
        setError('Не удалось загрузить подробную информацию о выставке. Пожалуйста, повторите попытку позже.');
      } finally {
        setLoading(false);
      }
    };

    getExhibitionDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Загрузка деталей выставок...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link to="/exhibitions" className="btn btn-primary">Вернуться к выставкам</Link>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="container">
        <div className="not-found">Выставка не найдена</div>
        <Link to="/exhibitions" className="btn btn-primary">Вернуться к выставкам</Link>
      </div>
    );
  }

  return (
    <div className="exhibition-detail-page">
      <div className="exhibition-hero">
        <div className="container">
          <h1>{exhibition.title}</h1>
          <div className="exhibition-meta">
            <div className="meta-item">
              <FaCalendarAlt />
              <span className="exhibition-meta">{formatDate(exhibition.start_date)} - {formatDate(exhibition.end_date)}</span>
            </div>
            <div className="meta-item">
              <FaTicketAlt />
              <span className="exhibition-meta">₽{exhibition.ticket_price}</span>
            </div>
            <div className="meta-item">
              <FaClock />
              <span className="exhibition-meta">10:00 - 17:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="exhibition-content section">
        <div className="container">
          <div className="exhibition-layout">
            <div className="exhibition-info">
              <div className="exhibition-image">
                <img
                  src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/${exhibition.image_url}`}
                  alt={exhibition.title}
                />
              </div>
              
              <div className="exhibition-description">
                <h2>О выставке</h2>
                <p className="short-description">{exhibition.short_description}</p>
                <div className="full-description">{exhibition.full_description}</div>
              </div>
            </div>
            
            <div className="reservation-sidebar">
              <ReservationForm exhibition={exhibition} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="exhibition-cta section">
        <div className="container text-center">
          <h2>Больше выставок</h2>
          <p>Откройте для себя другие наши интересные выставки в музее.</p>
          <Link to="/exhibitions" className="btn btn-primary">Просмотреть все выставки</Link>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionDetailPage;
  