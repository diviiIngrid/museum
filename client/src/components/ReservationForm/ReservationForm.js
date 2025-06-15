import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createReservation } from '../../http/reservationAPI';
import { AuthContext } from '../../context/AuthContext';
import './ReservationForm.css';

const ReservationForm = ({ exhibition }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // текущая дата по умолчанию
  const [submitError, setSubmitError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // сообщения об ошибках при заполнении формы бронирования
  const validationSchema = Yup.object({
    visitor_name: Yup.string().required('Требуется указать имя'),
    visitor_email: Yup.string().email('Неверный адрес электронной почты').required('Требуется электронная почта'),
    visitor_phone: Yup.string().required('Требуется указать номер телефона'),
    visitor_count: Yup.number().min(1, 'Требуется как минимум 1 посетитель').max(10, 'Допускается не более 10 посетителей').required('Требуется количество посетителей')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitError('');
      const reservationData = {
        ...values,
        exhibition_id: exhibition.id,
        reservation_date: selectedDate.toISOString(),
        user_id: user ? user.id : null
      };
      // отправляет запрос на сревер
      await createReservation(reservationData);
      resetForm();
      setSelectedDate(new Date());
    
      if (user) {
        navigate('/profile'); // перенаправление на профиль при авторизованности пользователчя
      } else {
        navigate('/visit', { state: { reservation: true } }); // перенаправление на страницу визита 
      }
    } catch (error) {
      setSubmitError('Ошибка бронирования. Попробуйте еще раз');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  //даты до сегодняшнего дня и после даты окончания выставки
  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(exhibition.end_date);
    const startDate = new Date(exhibition.start_date);
    return date < today || date > endDate || date < startDate;
  };

  return (
    <div className="reservation-form-container">
      <h2>Бронирование</h2>
      
      <div className="date-selection">
        <h3>Выберите дату</h3>
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          tileDisabled={tileDisabled}
          minDate={new Date()}
          maxDate={new Date(exhibition.end_date)}
        />
        <p className="selected-date">
          Выберите дату: {selectedDate.toLocaleDateString()}
        </p>
      </div>
      {/* начальная форма если польователь авторизован */}
      <Formik
        initialValues={{
          visitor_name: user ? user.name || '' : '',
          visitor_email: user ? user.email || '' : '',
          visitor_phone: '',
          visitor_count: 1
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="reservation-form">
            <div className="form-group">
              <label htmlFor="visitor_name">Имя</label>
              <Field type="text" id="visitor_name" name="visitor_name" className="form-control" />
              <ErrorMessage name="visitor_name" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="visitor_email">Электронная почта</label>
              <Field type="email" id="visitor_email" name="visitor_email" className="form-control" />
              <ErrorMessage name="visitor_email" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="visitor_phone">Телефон</label>
              <Field type="text" id="visitor_phone" name="visitor_phone" className="form-control" />
              <ErrorMessage name="visitor_phone" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="visitor_count">Количество посетителей</label>
              <Field type="number" id="visitor_count" name="visitor_count" min="1" max="10" className="form-control" />
              <ErrorMessage name="visitor_count" component="div" className="error-message" />
            </div>
            
            <div className="ticket-summary">
              <div className="ticket-total">
                <span>Сумма:</span>
                <span>₽{exhibition.ticket_price} x <Field name="visitor_count" /> = ₽{exhibition.ticket_price * document.querySelector('input[name="visitor_count"]')?.value || exhibition.ticket_price}</span>
              </div>
            </div>
            
            {submitError && <div className="error-message">{submitError}</div>}
            
            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? 'Бронирование...' : 'Бронируйте прямо сейчас'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReservationForm;
  