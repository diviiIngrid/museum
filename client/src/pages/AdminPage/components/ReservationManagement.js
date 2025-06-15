import React, { useState, useEffect } from 'react';
import { 
  fetchAllReservations,
  updateReservationStatus
} from '../../../http/reservationAPI';
import { FaCheck, FaTimes, FaEllipsisH } from 'react-icons/fa';
import './ReservationManagement.css';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updating, setUpdating] = useState(null);

  const statusToRussian = {
    ALL: 'Все',
    PENDING: 'В обработке',
    CONFIRMED: 'Подтверждено',
    CANCELLED: 'Отменено'
  };

  useEffect(() => {
    fetchReservationsData();
  }, []);

  const fetchReservationsData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Ошибка в вводе бронирований:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdating(id);
      await updateReservationStatus(id, status);
      setReservations(reservations.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status } 
          : reservation
      ));
    } catch (error) {
      console.error('Ошибка статуса обновления:', error);
      alert('Не удалось обновить статус бронирований');
    } finally {
      setUpdating(null);
    }
  };

  const filteredReservations = statusFilter === 'ALL' 
    ? reservations 
    : reservations.filter(r => r.status === statusFilter);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="reservation-management">
      <div className="panel-header">
        <h2>Управление бронированиями</h2>
        <div className="status-filters">
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(status => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {statusToRussian[status]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Загрузка бронирований...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="no-data">
          {statusFilter === 'ALL' 
            ? 'Бронирований не найдено.' 
            : `Нет бронирований со статусом "${statusToRussian[statusFilter]}".`}
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID бронирования</th>
                <th>Выставки</th>
                <th>Дата</th>
                <th>Пользователь</th>
                <th>Билеты</th>
                <th>Статус</th>
                <th>Подтверждение</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.exhibition_title}</td>
                  <td>{formatDate(reservation.reservation_date)}</td>
                  <td>
                    <div>{reservation.visitor_name}</div>
                    <div className="visitor-email">{reservation.visitor_email}</div>
                  </td>
                  <td>{reservation.visitor_count}</td>
                  <td>
                    <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                      {statusToRussian[reservation.status] || reservation.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {reservation.status === 'PENDING' && (
                        <>
                          <button 
                            className="btn-icon confirm" 
                            onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                            disabled={updating === reservation.id}
                            title="Подтвердить"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="btn-icon cancel" 
                            onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                            disabled={updating === reservation.id}
                            title="Отменить"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {reservation.status === 'CONFIRMED' && (
                        <button 
                          className="btn-icon cancel" 
                          onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                          disabled={updating === reservation.id}
                          title="Отменить"
                        >
                          <FaTimes />
                        </button>
                      )}
                      {reservation.status === 'CANCELLED' && (
                        <span className="no-action">
                          <FaEllipsisH />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;
