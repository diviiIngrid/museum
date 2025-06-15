import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getProfile, updateProfile } from '../../http/userAPI';
import { fetchUserReservations, cancelReservation } from '../../http/reservationAPI';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaTicketAlt, FaCalendarAlt, FaCheck, FaTimes, FaHourglass } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
        
        const reservationsData = await fetchUserReservations();
        setReservations(reservationsData);
      } catch (error) {
        console.error('Ошибка получения профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Требуется указать имя'),
    email: Yup.string().email('Требуется указать электронную почту').required('Требуется электронная почта')
  });

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      await updateProfile(values);
      setProfile(values);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('ошибка загрузки профиля:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      setCancelId(id);
      await cancelReservation(id);
      setReservations(reservations.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: 'CANCELLED' } 
          : reservation
      ));
    } catch (error) {
      console.error('Ошибка в отменении бронирования:', error);
    } finally {
      setCancelId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return (
        <>
          <FaCheck className="status-icon confirmed" />
          <span>Подтверждено</span>
        </>
      );
    case 'CANCELLED':
      return (
        <>
          <FaTimes className="status-icon cancelled" />
          <span>Отменено</span>
        </>
      );
    case 'PENDING':
    default:
      return (
        <>
          <FaHourglass className="status-icon pending" />
          <span>В ожидании</span>
        </>
      );
  }
};


  if (loading) {
    return (
      <div className="container">
        <div className="loading">Загрузка данных профиля</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <h1>Мой аккаунт</h1>
        </div>
      </div>

      <div className="profile-content section">
        <div className="container">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser />
              <span>Профиль</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <FaTicketAlt />
              <span>Мои бронирования</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="profile-tab">
                <div className="profile-card">
                  <h2>Персональные данные</h2>
                  
                  {updateSuccess && (
                    <div className="update-success">
                      Провиль успешно обнавлен
                    </div>
                  )}
                  
                  <Formik
                    initialValues={{
                      name: profile.name || '',
                      email: profile.email || ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ isSubmitting }) => (
                      <Form className="profile-form">
                        <div className="form-group">
                          <label htmlFor="name">Имя</label>
                          <Field type="text" id="name" name="name" className="form-control" />
                          <ErrorMessage name="name" component="div" className="error-message" />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="email">Эл.почта</label>
                          <Field type="email" id="email" name="email" className="form-control" />
                          <ErrorMessage name="email" component="div" className="error-message" />
                        </div>
                        
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Сохранеие' : 'Сохранить изменения'}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="reservations-tab">
                <h2>Мои бронирования</h2>
                
                {reservations.length === 0 ? (
                  <div className="no-reservations">
                    <p>У вас еще нет бронирований</p>
                    <a href="/exhibitions" className="btn btn-primary"> а</a>
                  </div>
                ) : (
                  <div className="reservations-list">
                    {reservations.map(reservation => (
                      <div key={reservation.id} className="reservation-card">
                        <div className="reservation-image">
                          <img 
                            src={reservation.image_url ? `${process.env.REACT_APP_API_URL}/${reservation.image_url}` : '/images/placeholder.jpg'} 
                            alt={reservation.exhibition_title} 
                          />
                        </div>
                        <div className="reservation-details">
                          <h3>{reservation.exhibition_title}</h3>
                          <div className="reservation-meta">
                            <div className="meta-item">
                              <FaCalendarAlt />
                              <span>Дата: {formatDate(reservation.reservation_date)}</span>
                            </div>
                            <div className="meta-item">
                              <FaTicketAlt />
                              <span> Билеты: {reservation.visitor_count} × {reservation.ticket_price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
                            </div>
                            <div className="meta-item status">
                              <span>Статус: </span>
                              <span className={`status-label ${reservation.status.toLowerCase()}`}>
                                {getStatusIcon(reservation.status)}
                              </span>
                            </div>
                          </div>
                          <div className="reservation-actions">
                            {reservation.status !== 'CANCELLED' && (
                              <button 
                                onClick={() => handleCancelReservation(reservation.id)} 
                                className="btn btn-outline btn-cancel"
                                disabled={cancelId === reservation.id}
                              >
                                {cancelId === reservation.id ? 'Отменение...' : 'Отменить бронирование'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
  