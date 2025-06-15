import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchExhibitions } from '../../http/exhibitionAPI';
import ExhibitionCard from '../../components/ExhibitionCard/ExhibitionCard';
import { FaArrowRight, FaTicketAlt, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [featuredExhibitions, setFeaturedExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedExhibitions = async () => {
      try {
        const data = await fetchExhibitions(1, 3);
        setFeaturedExhibitions(data.rows);
      } catch (error) {
        console.error('Ошибка получения выставок:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedExhibitions();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Окунись в историю</h1>
            <p>Откройте для себя наши выставки и коллекции</p>
            <div className="hero-buttons">
              <Link to="/exhibitions" className="btn btn-primary">Выставки</Link>
              <Link to="/visit" className="btn btn-outline">Информация</Link>
            </div>
          </div>
        </div>
      </section>

      {/* секуия про Выставки */}
      <section className="featured-exhibitions section">
        <div className="container">
          <div className="section-header">
            <h2>Избранные выставки</h2>
            <Link to="/exhibitions" className="view-all">
              показать все <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loading">загрузка</div>
          ) : (
            <div className="exhibitions-grid">
              {featuredExhibitions.map(exhibition => (
                <div key={exhibition.id} className="exhibition-item">
                  <ExhibitionCard exhibition={exhibition} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* секция про информацию */}
      <section className="visit-info section">
        <div className="container">
          <h2>Информация</h2>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">
                <FaCalendarAlt />
              </div>
              <h3>Часы работы</h3>
              <p>Среда-Воскресенье: с 10:00 до 18:00</p>
              <p>Понедельник-Вторник: выходные дни</p>
              <p>Кассы: с 10:00 до 17:00</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">
                <FaTicketAlt />
              </div>
              <h3>Льготное посещение</h3>
              <p>Пенисонеры</p>
              <p>Инвалиды</p>
              <p>Детям сиротам и детям, оставшимся без попечения родителей;</p>
              <p>Военнослужащим, проходящим военную службу по призыву.</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">
                <FaMapMarkedAlt />
              </div>
              <h3>Адрес</h3>
              <p>Республика Тыва, город Кызыл</p>
              <p>ул. Титова 30, 667000</p>
              <p>Электронная почта: tuva-museum@mail.ru</p>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/visit" className="btn btn-primary">Больше информации</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
  