import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaUtensils, FaStore } from 'react-icons/fa';
import './VisitPage.css';

const VisitPage = () => {
   const location = useLocation();
  const showReservationSuccess = location.state?.reservation;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="visit-page">
      <div className="visit-header">
        <div className="container">
          <h1>Информация</h1>
          <p>Все, что вам нужно знать для посещения нашего музея</p>
        </div>
      </div>

      {showReservationSuccess && (
        <div className="reservation-success">
          <div className="container">
            <h2>Бронирование прошло успешно</h2>
            <p>Благодарим вас за бронирование. Вскоре вы получите электронное письмо с подтверждением бронирования.</p>
            <p>Если вы создадите учетную запись, вы сможете управлять всеми своими бронированиями в своем профиле.</p>
            <div className="success-buttons">
              <Link to="/register" className="btn btn-primary">Создать аккаунт</Link>
              <Link to="/exhibitions" className="btn btn-outline">Больше информации о выставках</Link>
            </div>
          </div>
        </div>
      )}

      <div className="visit-content section">
        <div className="container">
          <div className="visit-grid">
            <div className="visit-info-card">
              <div className="info-icon">
                <FaCalendarAlt />
              </div>
              <h2>Часы работы</h2>
              <ul className="hours-list">
                <li>
                  <span className="day">Среда-Воскресенье:</span>
                  <span className="hours">10:00 - 18:00</span>
                </li>
                <li>
                  <span className="day">Понедельник-Вторник:</span>
                  <span className="hours">Выходные дни</span>
                </li>
              </ul>
              <p className="note">Последний вход за час до закрытия</p>
            </div>

            <div className="visit-info-card">
              <div className="info-icon">
                <FaTicketAlt />
              </div>
              <h2>Бесплатное посещение</h2>
              <div className="ticket-info">
                <div className="ticket-type">
                  <h3>Внеочередное бесплатное посещение</h3>
                  <ul>
                    <li>Героям Советского Союза, героям Российской Федерации и полным кавалерам ордена славы</li>
                    <li>Ветеранам и инвалидам Великой Отечественной Войны, участникам боевых действий</li>
                    <li>Детям дошкольного возраста</li>
                    <li>Сотрудникам музеев Российской Федерации и регионов Российской Федерации</li>
                    <li>Многодетным семьям</li>
                  </ul>
                </div>
                <div className="ticket-type">
                  <h3>Льготное посещение</h3>
                  <p>10% от стоимости билета</p>
                   <ul>
                    <li>инвалидам</li>
                    <li>пенсионерам</li>
                    <li>детям сиротам и детям, оставшимся без попечения родителей</li>
                    <li>военнослужащим, проходившим военную службу по призыву</li>
                  </ul>
                </div>
              </div>
              <p className="note">Примечание: Право бесплатного и льготного посещения возникает только при предоставлении соответствующего документа, удостоверяющего отнесение посетителя к соответствующей категории (удостоверение, отношение направляющей организации и др.).</p>
            </div>

            <div className="visit-info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <h2>Адрес</h2>
              <div className="location-info">
                <address>
                   ул. Титова 30<br />
                  Республика Тыва, город Кызыл<br />
                  Телефон: +7 (39422) 2-28-04<br />
                  Эл.почта: tuva-museum@mail.ru
                </address>
              </div>
            </div>
            </div>

            <div className="visit-info-card">
              <div className="info-icon">
                <FaUtensils />
              </div>
              <h2>Кафе</h2>
              <div className="dining-info">
                <div className="dining-info">
                <p>В национальном музее ежедневно работает уютное кафе. В кафе подается блюда повседневной кухни</p>
                <p>Среда-Воскресенье с 10:00 до 17:00</p>
              </div>
            </div>

            <div className="visit-info-card">
              <div className="info-icon">
                <FaStore />
              </div>
              <h2>Музейный магазин</h2>
              <div className="shop-info">
                <p>Музейный магазин предлагает широкий ассортимент товаров, в том числе:</p>
                <ul>
                  <li>Книги</li>
                  <li>Сувенири</li>
                  <li>Статуэтки</li>
                  <li>Платки</li>
                  <li>Магниты</li>
                </ul>
                <p>Часы работы: Среда-Воскресенье с 10:00 до 18:00</p>
                {/* <p>Online shopping available at <a href="https://shop.museum.com">shop.museum.com</a></p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="visit-cta section">
        <div className="container text-center">
          <h2>Готовы к песещению музея?</h2>
          <div className="cta-buttons">
            <Link to="/exhibitions" className="btn btn-primary">Больше выставок</Link>
          </div>
        </div>
      </div>
    </div>
    )
}

export default VisitPage;
  